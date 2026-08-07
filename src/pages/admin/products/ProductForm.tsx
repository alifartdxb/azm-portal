import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Save, ArrowLeft, Upload, CheckCircle, Plus, Trash2 } from 'lucide-react';
import { getDocument, createDocument, updateDocument, getCollection } from '../../../services/db';

const TABS = ['Basic Info', 'Descriptions', 'Attributes', 'Specifications', 'Media', 'Documents', 'Relations', 'SEO'];

export function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    nameEn: '',
    nameAr: '',
    slug: '',
    sku: '',
    modelNumber: '',
    brand: '',
    category: '',
    subCategory: '',
    collection: '',
    
    status: 'Draft',
    availabilityStatus: 'Available',
    featuredStatus: false,
    newProductStatus: false,

    shortDescriptionEn: '',
    shortDescriptionAr: '',
    fullDescriptionEn: '',
    fullDescriptionAr: '',

    features: '',
    technicalSpecifications: '',

    applications: '',
    installationType: '',
    colours: '',
    finishes: '',
    sizes: '',
    material: '',
    countryOfOrigin: '',
    warranty: '',
    certifications: '',
    dynamicAttributes: [] as { key: string, value: string }[],

    featuredImage: '',
    productImages: [] as string[],
    video: '',
    media360: '',
    altText: '',

    catalogues: [] as string[],
    technicalDocuments: [] as string[],

    relatedProducts: [] as string[],
    similarProducts: [] as string[],

    seoTitleEn: '',
    seoTitleAr: '',
    metaDescriptionEn: '',
    metaDescriptionAr: '',
    canonicalUrl: ''
  });

  useEffect(() => {
    loadDropdowns();
    if (isEdit && id) {
      loadProduct(id);
    }
  }, [id, isEdit]);

  const loadDropdowns = async () => {
    try {
      const [brandsData, categoriesData, productsData] = await Promise.all([
        getCollection('brands'),
        getCollection('categories'),
        getCollection('products')
      ]);
      setBrands(brandsData);
      setCategories(categoriesData);
      setAllProducts(productsData.filter(p => p.id !== id));
    } catch (e) {
      console.error("Failed to load dropdown data", e);
    }
  };

  const loadProduct = async (productId: string) => {
    try {
      setLoading(true);
      const data = await getDocument('products', productId);
      if (data) {
        setFormData(prev => ({ ...prev, ...data }));
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
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDynamicAttributeChange = (index: number, field: 'key' | 'value', value: string) => {
    const newAttrs = [...formData.dynamicAttributes];
    newAttrs[index][field] = value;
    setFormData(prev => ({ ...prev, dynamicAttributes: newAttrs }));
  };

  const addDynamicAttribute = () => {
    setFormData(prev => ({
      ...prev,
      dynamicAttributes: [...prev.dynamicAttributes, { key: '', value: '' }]
    }));
  };

  const removeDynamicAttribute = (index: number) => {
    const newAttrs = [...formData.dynamicAttributes];
    newAttrs.splice(index, 1);
    setFormData(prev => ({ ...prev, dynamicAttributes: newAttrs }));
  };

  const handleArraySelectChange = (e: React.ChangeEvent<HTMLSelectElement>, field: keyof typeof formData) => {
    const options = e.target.options;
    const values: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        values.push(options[i].value);
      }
    }
    setFormData(prev => ({ ...prev, [field]: values }));
  };

  const handleSave = async (redirect = true) => {
    try {
      setSaving(true);
      let dataToSave = { ...formData };
      
      if (!dataToSave.slug && dataToSave.nameEn) {
        dataToSave.slug = dataToSave.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      }

      if (isEdit && id) {
        await updateDocument('products', id, dataToSave);
      } else {
        await createDocument('products', {
          ...dataToSave,
          createdAt: new Date().toISOString(),
          deleted: false
        });
      }
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      if (redirect) {
        navigate('/admin/products');
      } else {
        if (!isEdit) {
          // Reset form somewhat, maybe keep brand/category
          setFormData(prev => ({
            ...prev, nameEn: '', nameAr: '', sku: '', modelNumber: '', slug: ''
          }));
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
              {isEdit ? `Editing ${formData.nameEn || formData.sku}` : 'Fill in the details to create a new product.'}
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

        <div className="flex-1">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 lg:p-8">
            
            {activeTab === 'Basic Info' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-brand-secondary border-b border-stone-100 pb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">English Product Name <span className="text-red-500">*</span></label>
                    <input type="text" name="nameEn" value={formData.nameEn} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Arabic Product Name</label>
                    <input type="text" name="nameAr" value={formData.nameAr} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" dir="rtl" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">SKU <span className="text-red-500">*</span></label>
                    <input type="text" name="sku" value={formData.sku} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Model Number</label>
                    <input type="text" name="modelNumber" value={formData.modelNumber} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Brand</label>
                    <select name="brand" value={formData.brand} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary bg-white">
                      <option value="">Select Brand</option>
                      {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary bg-white">
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Subcategory</label>
                    <input type="text" name="subCategory" value={formData.subCategory} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Collection</label>
                    <input type="text" name="collection" value={formData.collection} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Draft / Published</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary bg-white">
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Availability Status</label>
                    <select name="availabilityStatus" value={formData.availabilityStatus} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary bg-white">
                      <option value="Available">Available</option>
                      <option value="Out of Stock">Out of Stock</option>
                      <option value="Discontinued">Discontinued</option>
                      <option value="Pre-order">Pre-order</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-4 mt-8">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name="featuredStatus" checked={formData.featuredStatus} onChange={handleChange} className="w-5 h-5 text-brand-primary focus:ring-brand-primary rounded border-stone-300" />
                      <span className="text-sm font-bold text-stone-700">Featured Product</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name="newProductStatus" checked={formData.newProductStatus} onChange={handleChange} className="w-5 h-5 text-brand-primary focus:ring-brand-primary rounded border-stone-300" />
                      <span className="text-sm font-bold text-stone-700">New Product</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Descriptions' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-brand-secondary border-b border-stone-100 pb-4">Product Descriptions</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">English Short Description</label>
                    <textarea name="shortDescriptionEn" value={formData.shortDescriptionEn} onChange={handleChange} rows={3} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Arabic Short Description</label>
                    <textarea name="shortDescriptionAr" value={formData.shortDescriptionAr} onChange={handleChange} rows={3} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" dir="rtl" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">English Full Description</label>
                    <textarea name="fullDescriptionEn" value={formData.fullDescriptionEn} onChange={handleChange} rows={6} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Arabic Full Description</label>
                    <textarea name="fullDescriptionAr" value={formData.fullDescriptionAr} onChange={handleChange} rows={6} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" dir="rtl" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Attributes' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-brand-secondary border-b border-stone-100 pb-4">Product Attributes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-bold text-stone-700 mb-2">Applications</label><input type="text" name="applications" value={formData.applications} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary" placeholder="e.g. Bathroom, Kitchen" /></div>
                  <div><label className="block text-sm font-bold text-stone-700 mb-2">Installation Type</label><input type="text" name="installationType" value={formData.installationType} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary" placeholder="e.g. Wall Mounted" /></div>
                  <div><label className="block text-sm font-bold text-stone-700 mb-2">Colours</label><input type="text" name="colours" value={formData.colours} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary" placeholder="e.g. White, Black" /></div>
                  <div><label className="block text-sm font-bold text-stone-700 mb-2">Finishes</label><input type="text" name="finishes" value={formData.finishes} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary" placeholder="e.g. Matte, Glossy" /></div>
                  <div><label className="block text-sm font-bold text-stone-700 mb-2">Sizes</label><input type="text" name="sizes" value={formData.sizes} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary" placeholder="e.g. 60x60, 120x60" /></div>
                  <div><label className="block text-sm font-bold text-stone-700 mb-2">Material</label><input type="text" name="material" value={formData.material} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary" /></div>
                  <div><label className="block text-sm font-bold text-stone-700 mb-2">Country of Origin</label><input type="text" name="countryOfOrigin" value={formData.countryOfOrigin} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary" /></div>
                  <div><label className="block text-sm font-bold text-stone-700 mb-2">Warranty</label><input type="text" name="warranty" value={formData.warranty} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary" /></div>
                  <div className="md:col-span-2"><label className="block text-sm font-bold text-stone-700 mb-2">Certifications</label><input type="text" name="certifications" value={formData.certifications} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary" /></div>
                </div>

                <div className="pt-6 border-t border-stone-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-stone-800">Dynamic Attributes</h3>
                    <button type="button" onClick={addDynamicAttribute} className="flex items-center gap-1 text-sm font-bold text-brand-primary hover:text-brand-secondary">
                      <Plus size={16} /> Add Attribute
                    </button>
                  </div>
                  <div className="space-y-3">
                    {formData.dynamicAttributes.map((attr, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <input type="text" placeholder="Key (e.g. Water Flow)" value={attr.key} onChange={(e) => handleDynamicAttributeChange(index, 'key', e.target.value)} className="flex-1 border border-stone-200 rounded-lg px-4 py-2" />
                        <input type="text" placeholder="Value (e.g. 5 L/min)" value={attr.value} onChange={(e) => handleDynamicAttributeChange(index, 'value', e.target.value)} className="flex-1 border border-stone-200 rounded-lg px-4 py-2" />
                        <button type="button" onClick={() => removeDynamicAttribute(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}
                    {formData.dynamicAttributes.length === 0 && (
                      <p className="text-sm text-stone-500 italic">No dynamic attributes added.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Specifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-brand-secondary border-b border-stone-100 pb-4">Specifications</h2>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Features (Markdown or HTML)</label>
                  <textarea name="features" value={formData.features} onChange={handleChange} rows={6} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Technical Specifications</label>
                  <textarea name="technicalSpecifications" value={formData.technicalSpecifications} onChange={handleChange} rows={6} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" />
                </div>
              </div>
            )}

            {activeTab === 'Media' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-brand-secondary border-b border-stone-100 pb-4">Media</h2>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Featured Image URL</label>
                  <input type="text" name="featuredImage" value={formData.featuredImage} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary" />
                  {formData.featuredImage && (
                    <img src={formData.featuredImage} alt="Preview" className="mt-4 w-32 h-32 object-cover rounded-lg border border-stone-200" />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Product Images (comma separated URLs for now)</label>
                  <textarea 
                    value={formData.productImages.join(',\n')} 
                    onChange={(e) => setFormData(prev => ({...prev, productImages: e.target.value.split(',').map(s => s.trim()).filter(Boolean)}))}
                    rows={4} 
                    className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Video URL (YouTube/Vimeo)</label>
                  <input type="text" name="video" value={formData.video} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">360-Degree Media URL</label>
                  <input type="text" name="media360" value={formData.media360} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Alt Text (for accessibility & SEO)</label>
                  <input type="text" name="altText" value={formData.altText} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary" />
                </div>
              </div>
            )}

            {activeTab === 'Documents' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-brand-secondary border-b border-stone-100 pb-4">Documents</h2>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Catalogues (comma separated URLs)</label>
                  <textarea 
                    value={formData.catalogues.join(',\n')} 
                    onChange={(e) => setFormData(prev => ({...prev, catalogues: e.target.value.split(',').map(s => s.trim()).filter(Boolean)}))}
                    rows={3} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Technical Documents (comma separated URLs)</label>
                  <textarea 
                    value={formData.technicalDocuments.join(',\n')} 
                    onChange={(e) => setFormData(prev => ({...prev, technicalDocuments: e.target.value.split(',').map(s => s.trim()).filter(Boolean)}))}
                    rows={3} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary" 
                  />
                </div>
              </div>
            )}

            {activeTab === 'Relations' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-brand-secondary border-b border-stone-100 pb-4">Related Products</h2>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Related Products (Hold Ctrl/Cmd to select multiple)</label>
                  <select 
                    multiple 
                    value={formData.relatedProducts} 
                    onChange={(e) => handleArraySelectChange(e, 'relatedProducts')}
                    className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary h-48 bg-white"
                  >
                    {allProducts.map(p => <option key={p.id} value={p.id}>{p.nameEn || p.name} ({p.sku})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Similar Products (Hold Ctrl/Cmd to select multiple)</label>
                  <select 
                    multiple 
                    value={formData.similarProducts} 
                    onChange={(e) => handleArraySelectChange(e, 'similarProducts')}
                    className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary h-48 bg-white"
                  >
                    {allProducts.map(p => <option key={p.id} value={p.id}>{p.nameEn || p.name} ({p.sku})</option>)}
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'SEO' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-brand-secondary border-b border-stone-100 pb-4">Search Engine Optimization</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Slug</label>
                    <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary font-mono text-sm" placeholder="Leave blank to auto-generate" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">English SEO Title</label>
                    <input type="text" name="seoTitleEn" value={formData.seoTitleEn} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Arabic SEO Title</label>
                    <input type="text" name="seoTitleAr" value={formData.seoTitleAr} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary" dir="rtl" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">English Meta Description</label>
                    <textarea name="metaDescriptionEn" value={formData.metaDescriptionEn} onChange={handleChange} rows={3} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-bold text-stone-700 mb-2">Canonical URL</label>
                      <input type="text" name="canonicalUrl" value={formData.canonicalUrl || ''} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary" placeholder="https://www.azmgroup.ae/..." />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-700 mb-2">Schema Type</label>
                      <select name="schemaType" value={formData.schemaType || 'Product'} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary">
                        <option value="Product">Product</option>
                        <option value="Article">Article</option>
                        <option value="Service">Service</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-700 mb-2">Open Graph Title</label>
                      <input type="text" name="ogTitle" value={formData.ogTitle || ''} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-700 mb-2">Open Graph Image URL</label>
                      <input type="text" name="ogImage" value={formData.ogImage || ''} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-stone-700 mb-2">Open Graph Description</label>
                      <textarea name="ogDescription" value={formData.ogDescription || ''} onChange={handleChange} rows={2} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary" />
                    </div>
                    <div className="flex items-center gap-6 mt-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="index" checked={formData.index !== false} onChange={(e) => setFormData({...formData, index: e.target.checked})} className="rounded text-brand-primary focus:ring-brand-primary" />
                        <span className="text-sm font-bold text-stone-700">Index</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="follow" checked={formData.follow !== false} onChange={(e) => setFormData({...formData, follow: e.target.checked})} className="rounded text-brand-primary focus:ring-brand-primary" />
                        <span className="text-sm font-bold text-stone-700">Follow</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Arabic Meta Description</label>
                    <textarea name="metaDescriptionAr" value={formData.metaDescriptionAr} onChange={handleChange} rows={3} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary" dir="rtl" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Canonical URL</label>
                    <input type="text" name="canonicalUrl" value={formData.canonicalUrl} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-brand-primary" />
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
