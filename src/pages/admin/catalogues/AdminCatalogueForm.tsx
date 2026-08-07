import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Save, ArrowLeft, Upload, CheckCircle, FileText } from 'lucide-react';
import { getDocument, createDocument, updateDocument, getCollection } from '../../../services/db';

const TABS = ['Basic Info', 'Media', 'Details', 'SEO'];

export function AdminCatalogueForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Dropdowns (could be fetched, but hardcoded or derived for now to match UI requirements)
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    brand: '',
    category: '',
    productType: '',
    description: '',
    year: new Date().getFullYear().toString(),
    language: 'English',
    pages: '',
    fileSize: '',
    tags: '',
    
    thumbnail: '',
    pdfUrl: '',
    
    seoTitle: '',
    metaDescription: ''
  });

  useEffect(() => {
    loadDropdowns();
    if (isEdit && id) {
      loadCatalogue(id);
    }
  }, [id, isEdit]);

  const loadDropdowns = async () => {
    try {
      const [brandsData, categoriesData] = await Promise.all([
        getCollection('brands'),
        getCollection('categories')
      ]);
      setBrands(brandsData.length > 0 ? brandsData : [{name: 'VADO'}, {name: 'AZM'}, {name: 'Jaquar'}, {name: 'Roman'}]);
      setCategories(categoriesData.length > 0 ? categoriesData : [{name: 'Bathroom'}, {name: 'Tiles'}, {name: 'Marble'}, {name: 'Kitchen'}]);
    } catch (e) {
      console.error("Failed to load dropdowns", e);
    }
  };

  const loadCatalogue = async (catalogueId: string) => {
    try {
      setLoading(true);
      const data = await getDocument('catalogues', catalogueId);
      if (data) {
        setFormData({ ...formData, ...data });
      } else {
        alert('Catalogue not found');
        navigate('/admin/catalogues');
      }
    } catch (e) {
      console.error("Failed to load catalogue", e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (redirect = true) => {
    if (!formData.title || !formData.brand || !formData.category) {
      alert("Title, Brand, and Category are required.");
      return;
    }

    try {
      setSaving(true);
      
      const slug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const dataToSave = { ...formData, slug };

      if (isEdit && id) {
        await updateDocument('catalogues', id, dataToSave);
      } else {
        await createDocument('catalogues', {
          ...dataToSave,
          createdAt: new Date().toISOString()
        });
      }
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      if (redirect) {
        navigate('/admin/catalogues');
      } else {
        // Reset form for "Save & Add Another"
        if (!isEdit) {
          setFormData({
            title: '', slug: '', brand: '', category: '', productType: '', description: '',
            year: new Date().getFullYear().toString(), language: 'English', pages: '', fileSize: '', tags: '',
            thumbnail: '', pdfUrl: '', seoTitle: '', metaDescription: ''
          });
          setActiveTab(TABS[0]);
        }
      }
    } catch (e) {
      console.error("Failed to save catalogue", e);
      alert('Failed to save catalogue.');
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
          <Link to="/admin/catalogues" className="p-2 border border-stone-200 rounded-lg hover:bg-stone-50 text-stone-600 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-display text-brand-secondary">
              {isEdit ? 'Edit Catalogue' : 'Add New Catalogue'}
            </h1>
            <p className="text-stone-500 text-sm">
              {isEdit ? `Editing ${formData.title}` : 'Fill in the details to upload a new catalogue.'}
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
            onClick={() => navigate('/admin/catalogues')}
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
            <Save size={16} /> {saving ? 'Saving...' : 'Save Catalogue'}
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
            
            {/* STEP 1: Basic Info */}
            {activeTab === 'Basic Info' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-brand-secondary border-b border-stone-100 pb-4">Catalogue Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-bold text-stone-700 mb-2">Catalogue Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" name="title" value={formData.title} onChange={handleChange}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" 
                      placeholder="e.g. VADO Life Collection Catalogue" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Brand <span className="text-red-500">*</span></label>
                    <select 
                      name="brand" value={formData.brand} onChange={handleChange}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary bg-white"
                    >
                      <option value="">Select Brand</option>
                      {brands.map((b: any) => <option key={b.id || b.name} value={b.name}>{b.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Category <span className="text-red-500">*</span></label>
                    <select 
                      name="category" value={formData.category} onChange={handleChange}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary bg-white"
                    >
                      <option value="">Select Category</option>
                      {categories.map((c: any) => <option key={c.id || c.name} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Product Type</label>
                    <input 
                      type="text" name="productType" value={formData.productType} onChange={handleChange}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" 
                      placeholder="e.g. Mixers, Showers, Tiles" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">URL Slug</label>
                    <input 
                      type="text" name="slug" value={formData.slug} onChange={handleChange}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary font-mono text-sm" 
                      placeholder="Leave blank to auto-generate" 
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-bold text-stone-700 mb-2">Description</label>
                    <textarea 
                      name="description" value={formData.description} onChange={handleChange} rows={4}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" 
                      placeholder="Brief overview of what's inside this catalogue..." 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Media */}
            {activeTab === 'Media' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-brand-secondary border-b border-stone-100 pb-4">Media Files</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* PDF Upload */}
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">PDF File URL <span className="text-red-500">*</span></label>
                    <input 
                      type="text" name="pdfUrl" value={formData.pdfUrl} onChange={handleChange}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary mb-4" 
                      placeholder="https://..." 
                    />
                    <div className="border-2 border-dashed border-stone-300 rounded-xl p-8 text-center bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer">
                      <FileText className="mx-auto text-stone-400 mb-2" size={32} />
                      <p className="font-medium text-stone-700 text-sm">Upload PDF Document</p>
                      <p className="text-xs text-stone-500 mt-1">Maximum file size 50MB</p>
                    </div>
                  </div>

                  {/* Thumbnail Upload */}
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Cover Thumbnail URL</label>
                    <input 
                      type="text" name="thumbnail" value={formData.thumbnail} onChange={handleChange}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary mb-4" 
                      placeholder="https://..." 
                    />
                    {formData.thumbnail ? (
                      <div className="aspect-[3/4] w-32 rounded-lg border border-stone-200 overflow-hidden">
                        <img src={formData.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-stone-300 rounded-xl p-8 text-center bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer">
                        <Upload className="mx-auto text-stone-400 mb-2" size={32} />
                        <p className="font-medium text-stone-700 text-sm">Upload Cover Image</p>
                        <p className="text-xs text-stone-500 mt-1">Vertical image recommended</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Details */}
            {activeTab === 'Details' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-brand-secondary border-b border-stone-100 pb-4">Additional Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Year</label>
                    <input 
                      type="text" name="year" value={formData.year} onChange={handleChange}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" 
                      placeholder="e.g. 2025" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Language</label>
                    <input 
                      type="text" name="language" value={formData.language} onChange={handleChange}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" 
                      placeholder="e.g. English, Arabic" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Number of Pages</label>
                    <input 
                      type="number" name="pages" value={formData.pages} onChange={handleChange}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">File Size (Text)</label>
                    <input 
                      type="text" name="fileSize" value={formData.fileSize} onChange={handleChange}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" 
                      placeholder="e.g. 15 MB" 
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-bold text-stone-700 mb-2">Tags / Keywords (comma separated)</label>
                    <input 
                      type="text" name="tags" value={formData.tags} onChange={handleChange}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" 
                      placeholder="e.g. luxury, modern, brassware" 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: SEO */}
            {activeTab === 'SEO' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-brand-secondary border-b border-stone-100 pb-4">Search Engine Optimization</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">SEO Title</label>
                    <input 
                      type="text" name="seoTitle" value={formData.seoTitle} onChange={handleChange}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" 
                      placeholder="Optional. Overrides default title."
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
