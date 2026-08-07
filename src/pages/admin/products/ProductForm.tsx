import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Save, ArrowLeft, Upload, CheckCircle } from 'lucide-react';
import { getDocument, createDocument, updateDocument, getCollection } from '../../../services/db';

const TABS = ['Basic Info', 'Description', 'Attributes', 'Media', 'Documents', 'SEO'];

export function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Dropdown data
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    brand: '',
    category: '',
    subCategory: '',
    collection: '',
    series: '',
    
    shortDescription: '',
    fullDescription: '',
    features: '',
    technicalSpec: '',
    
    finish: '',
    color: '',
    material: '',
    dimensions: '',
    warranty: '',
    status: 'Draft',
    
    mainImage: '',
    galleryImages: [] as string[],
    
    cataloguePdf: '',
    technicalSheet: '',
    installationGuide: '',
    warrantyPdf: '',
    
    seoTitle: '',
    metaDescription: '',
    urlSlug: ''
  });

  useEffect(() => {
    loadDropdowns();
    if (isEdit && id) {
      loadProduct(id);
    }
  }, [id, isEdit]);

  const loadDropdowns = async () => {
    try {
      const [brandsData, categoriesData] = await Promise.all([
        getCollection('brands'),
        getCollection('categories')
      ]);
      setBrands(brandsData);
      setCategories(categoriesData);
      // Collections could be derived or a separate collection
      // Mocking collections for now based on brands data if applicable, or just leave empty strings
    } catch (e) {
      console.error("Failed to load dropdown data", e);
    }
  };

  const loadProduct = async (productId: string) => {
    try {
      setLoading(true);
      const data = await getDocument('products', productId);
      if (data) {
        setFormData({ ...formData, ...data });
      } else {
        alert('Product not found');
        navigate('/admin/products');
      }
    } catch (e) {
      console.error("Failed to load product", e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (redirect = true) => {
    try {
      setSaving(true);
            let dataToSave = { ...formData };
      
      // Auto-generate slug if missing
      if (!dataToSave.urlSlug && dataToSave.name) {
        dataToSave.urlSlug = dataToSave.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      }
      
      // Ensure it has slug as well
      dataToSave.slug = dataToSave.urlSlug || dataToSave.slug || (dataToSave.name ? dataToSave.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '');

      if (isEdit && id) {
        await updateDocument('products', id, dataToSave);
      } else {
        await createDocument('products', {
          ...dataToSave,
          createdAt: new Date().toISOString()
        });
      }
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      if (redirect) {
        navigate('/admin/products');
      } else {
        // Reset form for "Save & Add Another"
        if (!isEdit) {
          setFormData({
            name: '', sku: '', brand: '', category: '', subCategory: '', collection: '', series: '',
            shortDescription: '', fullDescription: '', features: '', technicalSpec: '',
            finish: '', color: '', material: '', dimensions: '', warranty: '', status: 'Draft',
            mainImage: '', galleryImages: [],
            cataloguePdf: '', technicalSheet: '', installationGuide: '', warrantyPdf: '',
            seoTitle: '', metaDescription: '', urlSlug: ''
          });
          setActiveTab(TABS[0]);
        }
      }
    } catch (e) {
      console.error("Failed to save product", e);
      alert('Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-stone-200 border-t-brand-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link to="/admin/products" className="p-2 border border-stone-200 rounded-lg hover:bg-stone-50 text-stone-600 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-display text-brand-secondary">
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-stone-500 text-sm">
              {isEdit ? `Editing ${formData.name || formData.sku}` : 'Fill in the details to create a new product.'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {success && (
            <span className="flex items-center gap-2 text-green-600 text-sm font-medium">
              <CheckCircle size={16} /> Saved Successfully
            </span>
          )}
          <button 
            onClick={() => navigate('/admin/products')}
            className="px-4 py-2 border border-stone-200 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors"
          >
            Cancel
          </button>
          {!isEdit && (
            <button 
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-4 py-2 border border-stone-200 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors"
            >
              Save & Add Another
            </button>
          )}
          <button 
            onClick={() => handleSave(true)}
            disabled={saving}
            className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-secondary flex items-center gap-2 transition-colors"
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border border-stone-200 p-2 shadow-sm sticky top-24">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab 
                    ? 'bg-brand-primary/10 text-brand-primary' 
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 lg:p-8">
            
            {/* STEP 1: Basic Information */}
            {activeTab === 'Basic Info' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-brand-secondary border-b border-stone-100 pb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-bold text-stone-700 mb-2">Product Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" name="name" value={formData.name} onChange={handleChange}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" 
                      placeholder="e.g. VADO Individual Basin Mixer" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">SKU <span className="text-red-500">*</span></label>
                    <input 
                      type="text" name="sku" value={formData.sku} onChange={handleChange}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" 
                      placeholder="e.g. VADO-IND-100" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Brand</label>
                    <select 
                      name="brand" value={formData.brand} onChange={handleChange}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary bg-white"
                    >
                      <option value="">Select Brand</option>
                      {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                      <option value="VADO">VADO</option>
                      <option value="BAGNODESIGN">BAGNODESIGN</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Category</label>
                    <select 
                      name="category" value={formData.category} onChange={handleChange}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary bg-white"
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      <option value="Mixers">Mixers</option>
                      <option value="Showers">Showers</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Sub Category</label>
                    <input 
                      type="text" name="subCategory" value={formData.subCategory} onChange={handleChange}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Collection</label>
                    <input 
                      type="text" name="collection" value={formData.collection} onChange={handleChange}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" 
                      placeholder="e.g. Individual"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Series</label>
                    <input 
                      type="text" name="series" value={formData.series} onChange={handleChange}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Description */}
            {activeTab === 'Description' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-brand-secondary border-b border-stone-100 pb-4">Product Description</h2>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Short Description</label>
                  <textarea 
                    name="shortDescription" value={formData.shortDescription} onChange={handleChange} rows={3}
                    className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" 
                    placeholder="Brief summary for listings..." 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Full Description</label>
                  <textarea 
                    name="fullDescription" value={formData.fullDescription} onChange={handleChange} rows={6}
                    className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" 
                    placeholder="Detailed product description..." 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Features (one per line)</label>
                  <textarea 
                    name="features" value={formData.features} onChange={handleChange} rows={4}
                    className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" 
                    placeholder="- Feature 1&#10;- Feature 2" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Technical Specification (HTML/Text)</label>
                  <textarea 
                    name="technicalSpec" value={formData.technicalSpec} onChange={handleChange} rows={4}
                    className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" 
                  />
                </div>
              </div>
            )}

            {/* STEP 3: Attributes */}
            {activeTab === 'Attributes' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-brand-secondary border-b border-stone-100 pb-4">Product Attributes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Finish</label>
                    <input 
                      type="text" name="finish" value={formData.finish} onChange={handleChange}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" 
                      placeholder="e.g. Brushed Gold" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Color</label>
                    <input 
                      type="text" name="color" value={formData.color} onChange={handleChange}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Material</label>
                    <input 
                      type="text" name="material" value={formData.material} onChange={handleChange}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Dimensions</label>
                    <input 
                      type="text" name="dimensions" value={formData.dimensions} onChange={handleChange}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Warranty</label>
                    <input 
                      type="text" name="warranty" value={formData.warranty} onChange={handleChange}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" 
                      placeholder="e.g. 15 Years"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Availability Status</label>
                    <select 
                      name="status" value={formData.status} onChange={handleChange}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary bg-white"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Available">Available</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Media */}
            {activeTab === 'Media' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-brand-secondary border-b border-stone-100 pb-4">Media</h2>
                
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Main Image URL</label>
                  <div className="flex gap-4">
                    <input 
                      type="text" name="mainImage" value={formData.mainImage} onChange={handleChange}
                      className="flex-1 border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" 
                      placeholder="https://..." 
                    />
                  </div>
                  {formData.mainImage && (
                    <div className="mt-4 w-32 h-32 rounded-lg border border-stone-200 overflow-hidden">
                      <img src={formData.mainImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Simulated Drag & Drop for visual completeness */}
                <div className="mt-8">
                  <label className="block text-sm font-bold text-stone-700 mb-2">Upload Images (Gallery)</label>
                  <div className="border-2 border-dashed border-stone-300 rounded-xl p-8 text-center bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer">
                    <Upload className="mx-auto text-stone-400 mb-4" size={32} />
                    <p className="font-medium text-stone-700 mb-1">Click to upload or drag and drop</p>
                    <p className="text-xs text-stone-500">SVG, PNG, JPG or WebP</p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Documents */}
            {activeTab === 'Documents' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-brand-secondary border-b border-stone-100 pb-4">Documents</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Catalogue PDF URL</label>
                    <input 
                      type="text" name="cataloguePdf" value={formData.cataloguePdf} onChange={handleChange}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Technical Sheet URL</label>
                    <input 
                      type="text" name="technicalSheet" value={formData.technicalSheet} onChange={handleChange}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Installation Guide URL</label>
                    <input 
                      type="text" name="installationGuide" value={formData.installationGuide} onChange={handleChange}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Warranty PDF URL</label>
                    <input 
                      type="text" name="warrantyPdf" value={formData.warrantyPdf} onChange={handleChange}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: SEO */}
            {activeTab === 'SEO' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-brand-secondary border-b border-stone-100 pb-4">Search Engine Optimization</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">URL Slug</label>
                    <input 
                      type="text" name="urlSlug" value={formData.urlSlug} onChange={handleChange}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary font-mono text-sm" 
                      placeholder="e.g. vado-individual-basin-mixer"
                    />
                    <p className="text-xs text-stone-500 mt-1">Leave blank to auto-generate from Product Name</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">SEO Title</label>
                    <input 
                      type="text" name="seoTitle" value={formData.seoTitle} onChange={handleChange}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Meta Description</label>
                    <textarea 
                      name="metaDescription" value={formData.metaDescription} onChange={handleChange} rows={3}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" 
                    />
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
