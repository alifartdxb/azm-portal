import React, { useState, useEffect } from 'react';
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
}