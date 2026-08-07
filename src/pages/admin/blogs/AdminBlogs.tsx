import React, { useState, useEffect } from 'react';
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
      setBlogs(blogs.map((p: any) => p.id === id ? { ...p, status: newStatus } : p));
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

  const filteredBlogs = blogs.filter((p: any) => 
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
                        className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                          blog.status === 'Published' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {blog.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/blogs/edit/${blog.id}`} className="p-2 text-stone-400 hover:text-brand-primary bg-white rounded-lg border shadow-sm"><Edit size={16} /></Link>
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
}