import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Upload, FileSpreadsheet, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export function AdminCatalogueImport() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'validating' | 'importing' | 'success' | 'error'>('idle');

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

  const handleImport = () => {
    if (!file) return;
    setStatus('validating');
    
    // Simulate import process
    setTimeout(() => {
      setStatus('importing');
      setTimeout(() => {
        setStatus('success');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/catalogues" className="p-2 border border-stone-200 rounded-lg hover:bg-stone-50 text-stone-600 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-display text-brand-secondary">Bulk Import Catalogues</h1>
          <p className="text-stone-500 text-sm">Upload an Excel (.xlsx) or CSV file to bulk create catalogue records.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg font-bold text-stone-800">Upload Data File</h2>
          <button className="flex items-center gap-2 text-brand-primary text-sm font-bold hover:underline">
            <Download size={16} /> Download Template
          </button>
        </div>

        {status === 'success' ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-stone-800 mb-2">Import Successful</h3>
            <p className="text-stone-600 mb-8">Successfully imported 45 catalogues.</p>
            <Link 
              to="/admin/catalogues"
              className="px-6 py-2 bg-brand-primary text-white rounded-lg font-bold hover:bg-brand-secondary transition-colors inline-block"
            >
              Back to Catalogues
            </Link>
          </motion.div>
        ) : (
          <>
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
              <label htmlFor="file-upload" className="cursor-pointer block w-full h-full">
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

            {status === 'validating' && (
              <div className="mt-6 flex items-center gap-3 text-stone-600 bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <span className="text-sm font-medium">Validating file structure and data...</span>
              </div>
            )}
            
            {status === 'importing' && (
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm font-medium text-stone-600">
                  <span>Importing catalogues...</span>
                  <span>45%</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-primary h-full w-[45%] transition-all duration-300"></div>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-end gap-4 border-t border-stone-100 pt-6">
              <Link to="/admin/catalogues" className="px-6 py-2 border border-stone-200 rounded-lg text-sm font-bold text-stone-600 hover:bg-stone-50">
                Cancel
              </Link>
              <button 
                onClick={handleImport}
                disabled={!file || status !== 'idle'}
                className="px-6 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Upload size={16} /> 
                {status === 'validating' ? 'Validating...' : status === 'importing' ? 'Importing...' : 'Start Import'}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="bg-stone-50 rounded-xl p-6 border border-stone-200 max-w-4xl">
        <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
          <AlertCircle size={18} className="text-brand-primary" /> Required Columns
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm text-stone-600">
          <div className="font-mono bg-white px-2 py-1 border border-stone-200 rounded">Catalogue Name*</div>
          <div className="font-mono bg-white px-2 py-1 border border-stone-200 rounded">Brand*</div>
          <div className="font-mono bg-white px-2 py-1 border border-stone-200 rounded">Category*</div>
          <div className="font-mono bg-white px-2 py-1 border border-stone-200 rounded">Product Type</div>
          <div className="font-mono bg-white px-2 py-1 border border-stone-200 rounded">Tags</div>
          <div className="font-mono bg-white px-2 py-1 border border-stone-200 rounded">PDF URL*</div>
          <div className="font-mono bg-white px-2 py-1 border border-stone-200 rounded">Thumbnail URL</div>
        </div>
      </div>
    </div>
  );
}
