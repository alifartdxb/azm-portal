import React, { useState, useEffect } from 'react';
import { Upload, FileSpreadsheet, ArrowLeft, CheckCircle, AlertCircle, Download, X, Search, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import * as XLSX from 'xlsx';
import { getCollection, createDocument } from '../../../services/db';



export function ProductImport() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'validating' | 'preview' | 'importing' | 'success'>('idle');
  
  // Preview data
  const [validRows, setValidRows] = useState<any[]>([]);
  const [invalidRows, setInvalidRows] = useState<any[]>([]);
  const [duplicateSkus, setDuplicateSkus] = useState<any[]>([]);
  const [newBrands, setNewBrands] = useState<string[]>([]);
  const [newCategories, setNewCategories] = useState<string[]>([]);
  
  // Options
  const [duplicateAction, setDuplicateAction] = useState<'update' | 'skip'>('update');

  // Progress & Stats
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({ success: 0, updated: 0, failed: 0, skipped: 0, time: 0 });
  const [logs, setLogs] = useState<{ type: 'error' | 'success' | 'info', msg: string }[]>([]);

  // DB State
  const [existingBrands, setExistingBrands] = useState<any[]>([]);
  const [existingCategories, setExistingCategories] = useState<any[]>([]);
  const [existingProducts, setExistingProducts] = useState<any[]>([]);
  const [existingSkuMap, setExistingSkuMap] = useState(new Map());

  useEffect(() => {
    async function loadDb() {
      try {
        const [b, c, p] = await Promise.all([
          getCollection('brands'),
          getCollection('categories'),
          getCollection('products')
        ]);
        setExistingBrands(b);
        setExistingCategories(c);
        setExistingProducts(p);
        
        const skuMap = new Map();
        p.forEach((prod: any) => {
          if (prod.sku) skuMap.set(prod.sku.toLowerCase(), prod.id);
        });
        setExistingSkuMap(skuMap);

      } catch (e) {
        console.error("Failed to load existing db data", e);
      }
    }
    loadDb();
  }, [status === 'idle']);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setStatus('idle');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus('idle');
    }
  };

  const parseFile = async () => {
    if (!file) return;
    setStatus('validating');
    
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const json: any[] = XLSX.utils.sheet_to_json(worksheet);

      validateData(json);
    } catch (e) {
      console.error(e);
      alert("Failed to parse file. Make sure it's a valid Excel or CSV file.");
      setStatus('idle');
    }
  };

  const validateData = (data: any[]) => {
    const valid: any[] = [];
    const invalid: any[] = [];
    const duplicates: any[] = [];
    const brandsToCreate = new Set<string>();
    const categoriesToCreate = new Set<string>();

    data.forEach((row, index) => {
      const getVal = (possibleKeys: string[]) => {
        const key = Object.keys(row).find(k => possibleKeys.includes(k.toLowerCase().trim().replace(/\s+/g, '')));
        return key ? row[key] : undefined;
      };

      const sku = getVal(['sku', 'productcode', 'itemcode', 'id']);
      const nameEn = getVal(['nameen', 'productnameen', 'name', 'title', 'productname']);
      const nameAr = getVal(['namear', 'productnamear', 'arabicname']);
      const brand = getVal(['brand', 'brandname', 'manufacturer']);
      const category = getVal(['category', 'categoryname']);
      
      const errors = [];
      if (!sku) errors.push("Missing SKU");
      if (!nameEn) errors.push("Missing English Product Name");
      if (!brand) errors.push("Missing Brand");
      if (!category) errors.push("Missing Category");

      if (errors.length > 0) {
        invalid.push({ row: index + 2, data: row, errors });
      } else {
        const strBrand = String(brand);
        const strCategory = String(category);
        const strSku = String(sku);

        if (!existingBrands.find(b => b.name?.toLowerCase() === strBrand.toLowerCase())) {
          brandsToCreate.add(strBrand);
        }
        if (!existingCategories.find(c => c.name?.toLowerCase() === strCategory.toLowerCase())) {
          categoriesToCreate.add(strCategory);
        }
        
        const parsedRow = {
          sku: strSku,
          nameEn: String(nameEn),
          nameAr: nameAr ? String(nameAr) : '',
          modelNumber: getVal(['modelnumber', 'model']) || '',
          brand: strBrand,
          category: strCategory,
          subCategory: getVal(['subcategory']) || '',
          collection: getVal(['collection', 'family']) || '',
          shortDescriptionEn: getVal(['shortdescriptionen', 'shortdesc']) || '',
          shortDescriptionAr: getVal(['shortdescriptionar']) || '',
          fullDescriptionEn: getVal(['fulldescriptionen', 'description']) || '',
          fullDescriptionAr: getVal(['fulldescriptionar']) || '',
          features: getVal(['features']) || '',
          technicalSpecifications: getVal(['technicalspecifications', 'techspecs']) || '',
          applications: getVal(['applications']) || '',
          installationType: getVal(['installationtype']) || '',
          colours: getVal(['colours', 'colors', 'color']) || '',
          finishes: getVal(['finishes', 'finish']) || '',
          sizes: getVal(['sizes', 'size', 'dimensions']) || '',
          material: getVal(['material']) || '',
          countryOfOrigin: getVal(['countryoforigin', 'coo']) || '',
          warranty: getVal(['warranty']) || '',
          certifications: getVal(['certifications']) || '',
          availabilityStatus: getVal(['availabilitystatus', 'availability', 'status']) || 'Available',
          featuredImage: getVal(['featuredimage', 'image', 'imageurl', 'thumbnail', 'photo']) || '',
          status: 'Draft',
          raw: row
        };

        if (existingSkuMap.has(strSku.toLowerCase())) {
          duplicates.push(parsedRow);
        } else {
          valid.push(parsedRow);
        }
      }
    });

    setValidRows(valid);
    setDuplicateSkus(duplicates);
    setInvalidRows(invalid);
    setNewBrands(Array.from(brandsToCreate));
    setNewCategories(Array.from(categoriesToCreate));
    setStatus('preview');
  };

  const executeImport = async () => {
    setStatus('importing');
    setProgress(0);
    const startTime = Date.now();
    let sSuccess = 0, sUpdated = 0, sFailed = 0, sSkipped = invalidRows.length;
    const newLogs: any[] = [];

    // 1. Create missing Brands
    const brandMap = new Map();
    existingBrands.forEach(b => brandMap.set(b.name.toLowerCase(), b.id));
    
    for (const bName of newBrands) {
      try {
        const id = await createDocument('brands', { 
          name: bName, 
          slug: bName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          status: 'Published' 
        });
        brandMap.set(bName.toLowerCase(), id);
        newLogs.push({ type: 'info', msg: `Created new brand: ${bName}` });
      } catch (e) {
        console.error(e);
      }
    }

    // 2. Create missing Categories
    const catMap = new Map();
    existingCategories.forEach(c => catMap.set(c.name.toLowerCase(), c.id));
    
    for (const cName of newCategories) {
      try {
        const id = await createDocument('categories', { 
          name: cName, 
          slug: cName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          status: 'Published' 
        });
        catMap.set(cName.toLowerCase(), id);
        newLogs.push({ type: 'info', msg: `Created new category: ${cName}` });
      } catch (e) {
        console.error(e);
      }
    }

    // 3. Import Products
    const rowsToProcess = [...validRows];
    if (duplicateAction === 'update') {
      rowsToProcess.push(...duplicateSkus);
    } else {
      sSkipped += duplicateSkus.length;
    }

    for (let i = 0; i < rowsToProcess.length; i++) {
      const row = rowsToProcess[i];
      try {
        const productData = {
          ...row,
          slug: row.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + row.sku.toLowerCase(),
          updatedAt: new Date().toISOString(),
          deleted: false
        };
        delete productData.raw;

        const existingId = existingSkuMap.get(row.sku.toLowerCase());
        if (existingId) {
          if (duplicateAction === 'update') {
            await setDoc(doc(db, 'products', existingId), productData, { merge: true });
            sUpdated++;
          }
        } else {
          const safeId = row.sku.replace(/[^a-zA-Z0-9_-]/g, '_');
          await setDoc(doc(db, 'products', safeId), { ...productData, createdAt: new Date().toISOString() });
          sSuccess++;
        }
      } catch (e: any) {
        sFailed++;
        newLogs.push({ type: 'error', msg: `Failed to import SKU ${row.sku}: ${e.message}` });
      }
      setProgress(Math.round(((i + 1) / rowsToProcess.length) * 100));
    }

    const endTime = Date.now();
    const importStats = {
      success: sSuccess,
      updated: sUpdated,
      failed: sFailed,
      skipped: sSkipped,
      time: (endTime - startTime) / 1000
    };
    
    setStats(importStats);
    setLogs(newLogs);
    setStatus('success');

    // Store Import History
    try {
      await createDocument('import_history', {
        date: new Date().toISOString(),
        stats: importStats,
        logs: newLogs,
        type: 'Products'
      });
    } catch (e) {
      console.error("Failed to store import history", e);
    }
  };

  const downloadErrorLog = () => {
    if (invalidRows.length === 0 && logs.length === 0) return;
    
    let content = "Import Error Log\n=================\n\n";
    if (invalidRows.length > 0) {
      content += "INVALID ROWS (Skipped)\n---------------------\n";
      invalidRows.forEach(ir => {
        content += `Row ${ir.row}: ${ir.errors.join(', ')} | Data: ${JSON.stringify(ir.data)}\n`;
      });
      content += "\n";
    }
    
    if (logs.length > 0) {
      content += "EXECUTION LOGS\n---------------------\n";
      logs.forEach(l => {
        content += `[${l.type.toUpperCase()}] ${l.msg}\n`;
      });
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `import_errors_${new Date().toISOString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadTemplate = () => {
    const headers = [
      'SKU', 'Name En', 'Name Ar', 'Model Number', 'Brand', 'Category', 'Sub Category', 'Collection',
      'Short Description En', 'Short Description Ar', 'Full Description En', 'Full Description Ar',
      'Features', 'Technical Specifications', 'Applications', 'Installation Type', 'Colours', 'Finishes',
      'Sizes', 'Material', 'Country of Origin', 'Warranty', 'Certifications', 'Availability Status',
      'Featured Image'
    ];
    const ws = XLSX.utils.aoa_to_sheet([headers, ['EX-SKU-001', 'Example Basin Mixer', 'خلاط مغسلة', 'MX-101', 'VADO', 'Mixers', 'Basin', 'Individual', 'A nice mixer', 'خلاط جميل', 'Full desc', 'وصف كامل', 'Feature 1', 'Spec 1', 'Bathroom', 'Deck Mounted', 'Chrome', 'Polished', 'Medium', 'Brass', 'UK', '15 Years', 'CE', 'Available', 'https://example.com/image.jpg']]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "AZM_Products_Import_Template.xlsx");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/products" className="p-2 border border-stone-200 rounded-lg hover:bg-stone-50 text-stone-600 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-display text-brand-secondary">Import Products</h1>
            <p className="text-stone-500 text-sm">Upload an Excel (.xlsx) or CSV file to bulk create or update products.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8 max-w-4xl">
        
        {status === 'idle' && (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-bold text-stone-800">Upload Data File</h2>
              <button onClick={downloadTemplate} className="flex items-center gap-2 text-brand-primary text-sm font-bold hover:underline">
                <Download size={16} /> Download Template
              </button>
            </div>
            <div 
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors cursor-pointer
                ${file ? 'border-brand-primary bg-brand-primary/5' : 'border-stone-300 bg-stone-50 hover:bg-stone-100'}
              `}
            >
              <input 
                type="file" 
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                className="hidden" 
                id="file-upload"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" className="cursor-pointer block">
                <FileSpreadsheet className={`mx-auto mb-4 ${file ? 'text-brand-primary' : 'text-stone-400'}`} size={48} />
                <h3 className="font-bold text-lg text-stone-800 mb-2">
                  {file ? file.name : 'Select or drag file here'}
                </h3>
                <p className="text-stone-500 text-sm mb-6">
                  {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Supported formats: .xlsx, .csv'}
                </p>
                <span className="px-6 py-2 bg-white border border-stone-200 rounded-lg text-sm font-bold text-stone-600 hover:bg-stone-50 shadow-sm inline-block">
                  {file ? 'Change File' : 'Browse Files'}
                </span>
              </label>
            </div>
            <div className="mt-8 flex justify-end gap-4 border-t border-stone-100 pt-6">
              <Link to="/admin/products" className="px-6 py-2 border border-stone-200 rounded-lg text-sm font-bold text-stone-600 hover:bg-stone-50">
                Cancel
              </Link>
              <button 
                onClick={parseFile}
                disabled={!file}
                className="px-6 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-secondary transition-colors disabled:opacity-50"
              >
                Validate File
              </button>
            </div>
          </>
        )}

        {status === 'validating' && (
          <div className="py-12 text-center">
            <div className="w-12 h-12 border-4 border-stone-200 border-t-brand-primary rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-stone-800 mb-2">Validating File...</h3>
            <p className="text-stone-500">Checking columns and data integrity.</p>
          </div>
        )}

        {status === 'preview' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-brand-secondary border-b border-stone-100 pb-4">Import Preview</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Total Rows</p>
                <p className="text-2xl font-bold text-stone-800">{validRows.length + invalidRows.length + duplicateSkus.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <p className="text-xs font-bold uppercase tracking-wider text-green-600 mb-1">New (Ready)</p>
                <p className="text-2xl font-bold text-green-700">{validRows.length}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                <p className="text-xs font-bold uppercase tracking-wider text-yellow-600 mb-1">Duplicates</p>
                <p className="text-2xl font-bold text-yellow-700">{duplicateSkus.length}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                <p className="text-xs font-bold uppercase tracking-wider text-red-600 mb-1">Invalid</p>
                <p className="text-2xl font-bold text-red-700">{invalidRows.length}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">New Brands/Cats</p>
                <p className="text-2xl font-bold text-blue-700">{newBrands.length + newCategories.length}</p>
              </div>
            </div>

            {duplicateSkus.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4">
                <div className="flex items-center gap-2 text-yellow-800 font-bold mb-2">
                  <AlertCircle size={18} /> 
                  {duplicateSkus.length} rows have duplicate SKUs (already exist in database)
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-yellow-900 cursor-pointer">
                    <input type="radio" name="duplicateAction" checked={duplicateAction === 'update'} onChange={() => setDuplicateAction('update')} className="text-brand-primary focus:ring-brand-primary" />
                    Update existing products
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium text-yellow-900 cursor-pointer">
                    <input type="radio" name="duplicateAction" checked={duplicateAction === 'skip'} onChange={() => setDuplicateAction('skip')} className="text-brand-primary focus:ring-brand-primary" />
                    Skip duplicates
                  </label>
                </div>
              </div>
            )}

            {invalidRows.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mt-4">
                <div className="flex items-center gap-2 text-orange-800 font-bold mb-2">
                  <AlertCircle size={18} /> 
                  {invalidRows.length} rows have errors and will be skipped
                </div>
                <div className="max-h-32 overflow-y-auto text-sm text-orange-700 space-y-1">
                  {invalidRows.slice(0, 10).map((ir, i) => (
                    <div key={i}>Row {ir.row}: {ir.errors.join(', ')}</div>
                  ))}
                  {invalidRows.length > 10 && <div>...and {invalidRows.length - 10} more.</div>}
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-end gap-4 border-t border-stone-100 pt-6">
              <button 
                onClick={() => setStatus('idle')} 
                className="px-6 py-2 border border-stone-200 rounded-lg text-sm font-bold text-stone-600 hover:bg-stone-50"
              >
                Back
              </button>
              <button 
                onClick={executeImport}
                disabled={validRows.length === 0 && (duplicateAction === 'skip' || duplicateSkus.length === 0)}
                className="px-6 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-secondary transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Upload size={16} /> 
                Import {validRows.length + (duplicateAction === 'update' ? duplicateSkus.length : 0)} Rows
              </button>
            </div>
          </div>
        )}

        {status === 'importing' && (
          <div className="py-12 text-center max-w-md mx-auto">
            <h3 className="text-xl font-bold text-stone-800 mb-6">Importing Products...</h3>
            <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden mb-4">
              <div 
                className="bg-brand-primary h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-stone-500 font-medium">{progress}% Complete</p>
            <p className="text-sm text-stone-400 mt-2">Please do not close this window.</p>
          </div>
        )}

        {status === 'success' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-6">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-2xl font-bold text-stone-800 mb-2">Import Completed</h3>
              <p className="text-stone-600">Process finished in {stats.time.toFixed(1)} seconds.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-center">
                <p className="text-2xl font-bold text-stone-800">{stats.success}</p>
                <p className="text-xs font-bold uppercase text-stone-500">New Inserted</p>
              </div>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-center">
                <p className="text-2xl font-bold text-stone-800">{stats.updated}</p>
                <p className="text-xs font-bold uppercase text-stone-500">Updated</p>
              </div>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-center">
                <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
                <p className="text-xs font-bold uppercase text-red-400">Failed</p>
              </div>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-center">
                <p className="text-2xl font-bold text-orange-500">{stats.skipped}</p>
                <p className="text-xs font-bold uppercase text-orange-400">Skipped</p>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              {(stats.failed > 0 || stats.skipped > 0 || logs.length > 0) && (
                <button 
                  onClick={downloadErrorLog}
                  className="px-6 py-3 border border-stone-200 rounded-xl font-bold text-stone-600 hover:bg-stone-50 flex items-center gap-2"
                >
                  <Download size={18} /> Download Report
                </button>
              )}
              <Link 
                to="/admin/products"
                className="px-6 py-3 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-secondary transition-colors flex items-center gap-2"
              >
                Go to Products <ChevronRight size={18} />
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
