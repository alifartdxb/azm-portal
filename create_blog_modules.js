import fs from 'fs';
import path from 'path';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}
ensureDir('src/pages/admin/blogs');

const list = `import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { getCollection, updateDocument, deleteDocument } from '../../../services/db';

export function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getCollection('blogs');
        setBlogs(data);
      } catch (err) {
        console.error("Failed to load blogs", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);
  
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Published' ? 'Draft' : 'Published';
    try {
      await updateDocument('blogs', id, { status: newStatus });
      setBlogs(blogs.map(p => p.id === id ? { ...p, status: newStatus } : p));
    } catch (e) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deleteDocument('blogs', id);
        setBlogs(blogs.filter(p => p.id !== id));
      } catch (e) {
        alert("Failed to delete blog");
      }
    }
  };

  const filteredBlogs = blogs.filter(p => 
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-brand-secondary">Blog Posts</h1>
          <p className="text-stone-500 text-sm">Manage articles and guides</p>
        </div>
        <Link 
          to="/admin/blogs/add"
          className="bg-brand-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-brand-secondary transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> Add Post
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-stone-100 bg-stone-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input 
              type="text" 
              placeholder="Search posts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-stone-50 text-stone-500 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-stone-500">Loading...</td>
                </tr>
              ) : filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-stone-500">No blogs found.</td>
                </tr>
              ) : (
                filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-stone-800">{blog.title}</td>
                    <td className="px-6 py-4 text-stone-600">{blog.category}</td>
                    <td className="px-6 py-4 text-stone-600">{blog.publishDate || 'Not set'}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toggleStatus(blog.id, blog.status)}
                        className={\`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 \${
                          blog.status === 'Published' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-stone-100 text-stone-600'
                        }\`}
                      >
                        {blog.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={\`/admin/blogs/edit/\${blog.id}\`} className="p-2 text-stone-400 hover:text-brand-primary bg-white rounded-lg border shadow-sm"><Edit size={16} /></Link>
                        <button onClick={() => handleDelete(blog.id)} className="p-2 text-stone-400 hover:text-red-500 bg-white rounded-lg border shadow-sm"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}`;
fs.writeFileSync('src/pages/admin/blogs/AdminBlogs.tsx', list);

const form = `import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Plus, X } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createDocument, getDocument, updateDocument } from '../../../services/db';

export function AdminBlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    titleAr: '',
    content: '',
    contentAr: '',
    category: 'Company News',
    author: 'Admin',
    featuredImage: '',
    tags: '',
    readingTime: '5 min',
    status: 'Draft',
    publishDate: new Date().toISOString().split('T')[0],
    seoTitle: '',
    seoDescription: ''
  });

  const categories = ['Product Guides', 'Bathroom Ideas', 'Tile Trends', 'Technical Advice', 'Contractor Resources', 'Consultant Resources', 'Project Inspiration', 'Brand Features', 'Maintenance Guides', 'UAE Construction Insights', 'Company News'];

  useEffect(() => {
    async function loadData() {
      if (!isEditing) return;
      try {
        const data = await getDocument('blogs', id);
        if (data) {
          setFormData({
            ...formData,
            ...data
          });
        }
      } catch (err) {
        console.error("Failed to load blog", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const dataToSave = {
        ...formData,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        updatedAt: new Date().toISOString()
      };
      
      if (isEditing) {
        await updateDocument('blogs', id, dataToSave);
      } else {
        dataToSave.createdAt = new Date().toISOString();
        await createDocument('blogs', dataToSave);
      }
      navigate('/admin/blogs');
    } catch (err) {
      alert("Failed to save blog");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link to="/admin/blogs" className="p-2 border rounded-lg hover:bg-stone-50"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-bold">{isEditing ? 'Edit Post' : 'Add Post'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border space-y-4">
          <h2 className="text-lg font-bold">English Content</h2>
          <div>
            <label className="block text-sm font-bold mb-1">Title *</label>
            <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Content</label>
            <textarea name="content" value={formData.content} onChange={handleChange} rows="10" className="w-full px-4 py-2 border rounded-lg"></textarea>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border space-y-4">
          <h2 className="text-lg font-bold">Arabic Content</h2>
          <div>
            <label className="block text-sm font-bold mb-1">Title (Arabic)</label>
            <input type="text" name="titleAr" value={formData.titleAr} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" dir="rtl" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Content (Arabic)</label>
            <textarea name="contentAr" value={formData.contentAr} onChange={handleChange} rows="10" className="w-full px-4 py-2 border rounded-lg" dir="rtl"></textarea>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border space-y-4">
          <h2 className="text-lg font-bold">Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Author</label>
              <input type="text" name="author" value={formData.author} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Publish Date</label>
              <input type="date" name="publishDate" value={formData.publishDate} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                <option value="Draft">Draft</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Published">Published</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Tags (comma separated)</label>
              <input type="text" name="tags" value={formData.tags} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Reading Time</label>
              <input type="text" name="readingTime" value={formData.readingTime} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Featured Image URL</label>
            <input type="text" name="featuredImage" value={formData.featuredImage} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border space-y-4">
          <h2 className="text-lg font-bold">SEO Settings</h2>
          <div>
            <label className="block text-sm font-bold mb-1">SEO Title</label>
            <input type="text" name="seoTitle" value={formData.seoTitle} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">SEO Description</label>
            <textarea name="seoDescription" value={formData.seoDescription} onChange={handleChange} rows="2" className="w-full px-4 py-2 border rounded-lg"></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link to="/admin/blogs" className="px-6 py-2 border rounded-lg font-bold">Cancel</Link>
          <button type="submit" disabled={saving} className="bg-brand-primary text-white px-6 py-2 rounded-lg font-bold">
            {saving ? 'Saving...' : 'Save Post'}
          </button>
        </div>
      </form>
    </div>
  );
}`;
fs.writeFileSync('src/pages/admin/blogs/AdminBlogForm.tsx', form);
