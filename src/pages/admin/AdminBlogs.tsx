import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash, Eye, X, Save } from 'lucide-react';
import { OptimizedImage } from '../../components/OptimizedImage';
import { getCollection, createDocument, updateDocument, deleteDocument } from '../../services/db';

export function AdminBlogs() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Draft',
    content: '',
    image: '',
    slug: ''
  });

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const data = await getCollection('blogs');
      setBlogs(data);
    } catch (error) {
      console.error('Failed to load blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({ title: '', author: 'AZM Editorial', date: new Date().toISOString().split('T')[0], status: 'Draft', content: '', image: '', slug: '' });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (blog: any) => {
    setFormData({
      title: blog.title || '',
      author: blog.author || '',
      date: blog.date || '',
      status: blog.status || 'Draft',
      content: blog.content || '',
      image: blog.image || '',
      slug: blog.slug || ''
    });
    setEditingId(blog.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      await deleteDocument('blogs', id);
      setBlogs(blogs.filter(b => b.id !== id));
    } catch (error) {
      console.error('Failed to delete blog:', error);
      alert('Failed to delete blog.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return alert('Title is required');
    
    try {
      setSaving(true);
      const slug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const dataToSave = { ...formData, slug };
      
      if (editingId) {
        await updateDocument('blogs', editingId, dataToSave);
      } else {
        await createDocument('blogs', { ...dataToSave, createdAt: new Date().toISOString() });
      }
      
      await loadBlogs();
      setShowForm(false);
    } catch (error) {
      console.error('Failed to save blog:', error);
      alert('Failed to save blog.');
    } finally {
      setSaving(false);
    }
  };

  const filteredBlogs = blogs.filter(b => (b.title && b.title.toLowerCase().includes(searchQuery.toLowerCase())) || false);

  if (showForm) {
    return (
      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-stone-800">{editingId ? 'Edit Article' : 'New Article'}</h2>
          <button onClick={() => setShowForm(false)} className="text-stone-400 hover:text-stone-600">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-stone-700 mb-1">Title *</label>
              <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-brand-primary" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Author</label>
              <input type="text" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-brand-primary" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Date</label>
              <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-brand-primary" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-brand-primary">
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Cover Image URL</label>
              <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-brand-primary" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-stone-700 mb-1">Content (Markdown supported)</label>
              <textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} rows={8} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-brand-primary font-mono text-sm" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-stone-200 text-stone-600 rounded-lg">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-brand-primary text-white rounded-lg flex items-center gap-2">
              <Save size={16} /> {saving ? 'Saving...' : 'Save Article'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-stone-800">Blog Management</h1>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-semibold hover:bg-brand-secondary transition-colors shadow-sm"
        >
          <Plus size={16} /> New Article
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-stone-400" size={18} />
          <input
            className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary bg-stone-50 text-sm transition-all"
            type="text"
            placeholder="Search articles by title..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-xs uppercase tracking-wider text-stone-500 font-bold">
                <th className="p-4">Title</th>
                <th className="p-4">Author</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-stone-500">Loading...</td></tr>
              ) : filteredBlogs.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-stone-500">No articles found.</td></tr>
              ) : filteredBlogs.map((blog) => (
                <tr key={blog.id} className="border-b border-stone-100 hover:bg-stone-50/50 transition-colors">
                  <td className="p-4 font-semibold text-stone-800">{blog.title}</td>
                  <td className="p-4 text-stone-600">{blog.author}</td>
                  <td className="p-4 text-stone-600">{blog.date}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      blog.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {blog.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 text-stone-400">
                      <button onClick={() => handleEdit(blog)} className="p-1 hover:text-brand-primary transition-colors"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(blog.id)} className="p-1 hover:text-red-500 transition-colors"><Trash size={16} /></button>
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
