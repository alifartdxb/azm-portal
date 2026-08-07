import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Upload, X, Plus } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createDocument, getDocument, updateDocument } from '../../../services/db';

export function AdminProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    emirate: 'Dubai',
    category: 'Residential',
    completionYear: new Date().getFullYear().toString(),
    client: '',
    consultant: '',
    contractor: '',
    scope: '',
    challenges: '',
    solution: '',
    featuredImage: '',
    gallery: [],
    videoUrl: '',
    status: 'Draft',
    seoTitle: '',
    seoDescription: ''
  });

  const emirates = ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'];
  const categories = ['Villas', 'Residential', 'Hospitality', 'Retail', 'Commercial', 'Office', 'Healthcare', 'Education', 'Public Sector', 'Renovation'];

  useEffect(() => {
    async function loadData() {
      if (!isEditing) return;
      try {
        const data = await getDocument('projects', id);
        if (data) {
          const projData = data as any;
          setFormData({
            ...formData,
            ...projData,
            gallery: projData.gallery || []
          });
        }
      } catch (err) {
        console.error("Failed to load project", err);
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
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        updatedAt: new Date().toISOString()
      };
      
      if (isEditing) {
        await updateDocument('projects', id, dataToSave);
      } else {
        dataToSave.createdAt = new Date().toISOString();
        await createDocument('projects', dataToSave);
      }
      navigate('/admin/projects');
    } catch (err) {
      alert("Failed to save project");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGalleryAdd = () => {
    const url = prompt("Enter image URL");
    if (url) {
      setFormData(prev => ({ ...prev, gallery: [...prev.gallery, url] }));
    }
  };

  const handleGalleryRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link to="/admin/projects" className="p-2 border border-stone-200 rounded-lg hover:bg-stone-50 text-stone-600 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-display text-brand-secondary">
            {isEditing ? 'Edit Project' : 'Add New Project'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-6">
          <h2 className="text-lg font-bold text-stone-800 border-b border-stone-100 pb-2">Basic Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Project Name *</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Emirate</label>
              <select name="emirate" value={formData.emirate} onChange={handleChange} className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20">
                {emirates.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Specific Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Completion Year</label>
              <input type="text" name="completionYear" value={formData.completionYear} onChange={handleChange} className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20">
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-6">
          <h2 className="text-lg font-bold text-stone-800 border-b border-stone-100 pb-2">Stakeholders</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Client</label>
              <input type="text" name="client" value={formData.client} onChange={handleChange} className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Consultant</label>
              <input type="text" name="consultant" value={formData.consultant} onChange={handleChange} className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Contractor</label>
              <input type="text" name="contractor" value={formData.contractor} onChange={handleChange} className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-6">
          <h2 className="text-lg font-bold text-stone-800 border-b border-stone-100 pb-2">Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Scope</label>
              <textarea name="scope" value={formData.scope} onChange={handleChange} rows="3" className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20" placeholder="Scope of supply..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Challenges</label>
              <textarea name="challenges" value={formData.challenges} onChange={handleChange} rows="3" className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20"></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Solution</label>
              <textarea name="solution" value={formData.solution} onChange={handleChange} rows="3" className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20"></textarea>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-6">
          <h2 className="text-lg font-bold text-stone-800 border-b border-stone-100 pb-2">Media</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Featured Image URL</label>
              <input type="text" name="featuredImage" value={formData.featuredImage} onChange={handleChange} className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
              {formData.featuredImage && (
                <div className="mt-2 w-32 h-32 rounded-lg border border-stone-200 overflow-hidden">
                  <img src={formData.featuredImage} alt="Featured" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Gallery Images</label>
              <div className="flex flex-wrap gap-4 mb-2">
                {formData.gallery.map((url, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-lg border border-stone-200 overflow-hidden group">
                    <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => handleGalleryRemove(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={handleGalleryAdd} className="w-24 h-24 rounded-lg border-2 border-dashed border-stone-300 flex flex-col items-center justify-center text-stone-400 hover:text-brand-primary hover:border-brand-primary transition-colors">
                  <Plus size={24} />
                  <span className="text-xs mt-1">Add Image</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Video URL (e.g. YouTube embed)</label>
              <input type="text" name="videoUrl" value={formData.videoUrl} onChange={handleChange} className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-6">
          <h2 className="text-lg font-bold text-stone-800 border-b border-stone-100 pb-2">SEO Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">SEO Title</label>
              <input type="text" name="seoTitle" value={formData.seoTitle} onChange={handleChange} className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">SEO Description</label>
              <textarea name="seoDescription" value={formData.seoDescription} onChange={handleChange} rows="2" className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20"></textarea>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link to="/admin/projects" className="px-6 py-2 border border-stone-200 rounded-lg text-sm font-bold text-stone-600 hover:bg-stone-50 transition-colors">
            Cancel
          </Link>
          <button type="submit" disabled={saving} className="bg-brand-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-secondary transition-colors flex items-center gap-2 disabled:opacity-50">
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Project'}
          </button>
        </div>
      </form>
    </div>
  );
}