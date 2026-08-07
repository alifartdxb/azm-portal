import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, Save, AlertCircle } from 'lucide-react';
import { OptimizedImage } from '../../components/OptimizedImage';
import { getCollection, createDocument, updateDocument, deleteDocument } from '../../services/db';

export function AdminBrands() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    country: '',
    description: '',
    logo: '',
    banner: '',
    website: '',
    isFeatured: false
  });

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      setLoading(true);
      const data = await getCollection('brands');
      setBrands(data);
    } catch (error) {
      console.error('Failed to load brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({ name: '', slug: '', country: '', description: '', logo: '', banner: '', website: '', isFeatured: false });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (brand: any) => {
    setFormData({
      name: brand.name || '',
      slug: brand.slug || '',
      country: brand.country || '',
      description: brand.description || '',
      logo: brand.logo || '',
      banner: brand.banner || '',
      website: brand.website || '',
      isFeatured: brand.isFeatured || false
    });
    setEditingId(brand.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this brand?')) return;
    try {
      await deleteDocument('brands', id);
      setBrands(brands.filter(b => b.id !== id));
    } catch (error) {
      console.error('Failed to delete brand:', error);
      alert('Failed to delete brand.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return alert('Brand name is required');
    
    try {
      setSaving(true);
      const slug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const dataToSave = { ...formData, slug };
      
      if (editingId) {
        await updateDocument('brands', editingId, dataToSave);
      } else {
        await createDocument('brands', { ...dataToSave, createdAt: new Date().toISOString() });
      }
      
      await loadBrands();
      setShowForm(false);
    } catch (error) {
      console.error('Failed to save brand:', error);
      alert('Failed to save brand.');
    } finally {
      setSaving(false);
    }
  };

  const filteredBrands = brands.filter(b => (b.name && b.name.toLowerCase().includes(searchQuery.toLowerCase())) || false);

  if (showForm) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-brand-secondary">{editingId ? 'Edit Brand' : 'Add New Brand'}</h2>
          <button onClick={() => setShowForm(false)} className="p-2 text-stone-400 hover:text-stone-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Brand Name <span className="text-red-500">*</span></label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-brand-primary" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Slug</label>
              <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-brand-primary font-mono text-sm" placeholder="Leave blank to auto-generate" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Country</label>
              <input type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-brand-primary" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Website</label>
              <input type="url" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-brand-primary" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-stone-700 mb-2">Description</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-brand-primary" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Logo URL</label>
              <input type="text" value={formData.logo} onChange={e => setFormData({...formData, logo: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-brand-primary" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Banner URL</label>
              <input type="text" value={formData.banner} onChange={e => setFormData({...formData, banner: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-brand-primary" />
            </div>
            <div className="flex items-center gap-2 mt-4 md:col-span-2">
              <input type="checkbox" id="isFeatured" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} className="rounded border-stone-300 text-brand-primary focus:ring-brand-primary w-4 h-4" />
              <label htmlFor="isFeatured" className="text-sm font-bold text-stone-700">Featured Brand</label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-stone-100">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-stone-200 text-stone-600 rounded-lg font-medium hover:bg-stone-50 transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-secondary transition-colors flex items-center gap-2">
              <Save size={16} /> {saving ? 'Saving...' : 'Save Brand'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-display text-brand-secondary">Brand Management</h1>
          <p className="text-stone-500 text-sm">Manage partner brands and their landing pages.</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-brand-secondary transition-colors">
          <Plus size={16} /> Add Brand
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-stone-200 bg-stone-50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
            <input 
              type="text" 
              placeholder="Search brands..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="px-6 py-4">Brand</th>
                <th className="px-6 py-4">Country</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-stone-500">Loading...</td></tr>
              ) : filteredBrands.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-stone-500">No brands found.</td></tr>
              ) : filteredBrands.map((brand) => (
                <tr key={brand.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 rounded border border-stone-200 bg-white flex items-center justify-center overflow-hidden flex-shrink-0 p-1">
                        {brand.logo ? (
                          <OptimizedImage src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
                        ) : (
                          <div className="w-full h-full bg-stone-200 flex items-center justify-center text-[10px] text-stone-500">No Img</div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-brand-secondary">{brand.name}</div>
                        <div className="text-xs text-stone-500 mt-1">/{brand.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-stone-600">{brand.country || '-'}</td>
                  <td className="px-6 py-4">
                    {brand.isFeatured ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-wider">
                        Featured
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-bold uppercase tracking-wider">
                        Standard
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(brand)} className="p-2 text-stone-400 hover:text-brand-primary transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(brand.id)} className="p-2 text-stone-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
