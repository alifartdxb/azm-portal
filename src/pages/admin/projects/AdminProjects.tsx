import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, LayoutGrid, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { getCollection, updateDocument, deleteDocument } from '../../../services/db';

export function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getCollection('projects');
        setProjects(data);
      } catch (err) {
        console.error("Failed to load projects", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);
  
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Published' ? 'Draft' : 'Published';
    try {
      await updateDocument('projects', id, { status: newStatus });
      setProjects(projects.map((p: any) => p.id === id ? { ...p, status: newStatus } : p));
    } catch (e) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteDocument('projects', id);
        setProjects(projects.filter(p => p.id !== id));
      } catch (e) {
        alert("Failed to delete project");
      }
    }
  };

  const filteredProjects = projects.filter((p: any) => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.client?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.emirate?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-brand-secondary">Projects</h1>
          <p className="text-stone-500 text-sm">Manage portfolio projects and references</p>
        </div>
        <Link 
          to="/admin/projects/add"
          className="bg-brand-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-brand-secondary transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> Add Project
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-stone-100 bg-stone-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input 
              type="text" 
              placeholder="Search projects..." 
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
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Year</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-stone-500">
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-5 h-5 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                      Loading projects...
                    </div>
                  </td>
                </tr>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-stone-500">
                    No projects found.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <motion.tr 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    key={project.id}
                    className="hover:bg-stone-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {project.featuredImage ? (
                          <img src={project.featuredImage} alt={project.name} className="w-12 h-12 rounded object-cover border border-stone-200" />
                        ) : (
                          <div className="w-12 h-12 bg-stone-100 rounded border border-stone-200 flex items-center justify-center text-stone-400">
                            <LayoutGrid size={20} />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-stone-800">{project.name}</p>
                          {project.client && <p className="text-xs text-stone-500">Client: {project.client}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-stone-600">
                      {project.emirate} {project.location ? `(${project.location})` : ''}
                    </td>
                    <td className="px-6 py-4 text-stone-600">
                      {project.category}
                    </td>
                    <td className="px-6 py-4 text-stone-600">
                      {project.completionYear}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toggleStatus(project.id, project.status)}
                        className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                          project.status === 'Published' 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {project.status === 'Published' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                        {project.status || 'Draft'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to={`/admin/projects/edit/${project.id}`}
                          className="p-2 text-stone-400 hover:text-brand-primary bg-white rounded-lg border border-stone-200 shadow-sm transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(project.id)}
                          className="p-2 text-stone-400 hover:text-red-500 bg-white rounded-lg border border-stone-200 shadow-sm transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}