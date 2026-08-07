import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { OptimizedImage } from '../../components/OptimizedImage';
import { getCollection, createDocument, updateDocument, deleteDocument } from '../../services/db';

export function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    image: '',
    description: ''
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getCollection('categories');
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({ name: '', slug: '', image: '', description: '' });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (cat: any) => {
    setFormData({
      name: cat.name || '',
      slug: cat.slug || '',
      image: cat.image || '',
      description: cat.description || ''
    });
    setEditingId(cat.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await deleteDocument('categories', id);
      setCategories(categories.filter(c => c.id !== id));
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Failed to delete category.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return alert('Category name is required');
    
    try {
      setSaving(true);
      const slug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const dataToSave = { ...formData, slug };
      
      if (editingId) {
        await updateDocument('categories', editingId, dataToSave);
      } else {
        await createDocument('categories', { ...dataToSave, createdAt: new Date().toISOString() });
      }
      
      await loadCategories();
      setShowForm(false);
    } catch (error) {
      console.error('Failed to save category:', error);
      alert('Failed to save category.');
    } finally {
      setSaving(false);
    }
  };

  const filteredCategories = categories.filter(c => (c.name && c.name.toLowerCase().includes(searchQuery.toLowerCase())) || false);

  if (showForm) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-brand-secondary">{editingId ? 'Edit Category' : 'Add New Category'}</h2>
          <button onClick={() => setShowForm(false)} className="p-2 text-stone-400 hover:text-stone-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Category Name <span className="text-red-500">*</span></label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-brand-primary" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Slug</label>
              <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-brand-primary font-mono text-sm" placeholder="Leave blank to auto-generate" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-stone-700 mb-2">Description</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-brand-primary" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-stone-700 mb-2">Image URL</label>
              <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-brand-primary" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-stone-100">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-stone-200 text-stone-600 rounded-lg font-medium hover:bg-stone-50 transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-secondary transition-colors flex items-center gap-2">
              <Save size={16} /> {saving ? 'Saving...' : 'Save Category'}
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
          <h1 className="text-2xl font-bold font-display text-brand-secondary">Category Management</h1>
          <p className="text-stone-500 text-sm">Manage product categories and taxonomy.</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-brand-secondary transition-colors">
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-stone-200 bg-stone-50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
            <input 
              type="text" 
              placeholder="Search categories..." 
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
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr><td colSpan={3} className="px-6 py-12 text-center text-stone-500">Loading...</td></tr>
              ) : filteredCategories.length === 0 ? (
                <tr><td colSpan={3} className="px-6 py-12 text-center text-stone-500">No categories found.</td></tr>
              ) : filteredCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded border border-stone-200 bg-stone-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {cat.image ? (
                          <OptimizedImage src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400">Img</div>
                        )}
                      </div>
                      <div className="font-bold text-brand-secondary">{cat.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-stone-500 font-mono text-xs">{cat.slug}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(cat)} className="p-2 text-stone-400 hover:text-brand-primary transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(cat.id)} className="p-2 text-stone-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
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
