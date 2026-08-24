import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getCollection, createDocument, updateDocument, deleteDocument } from "../../services/db";
import { Plus, Edit2, Trash2, X, Search, FileText, Database, AlertCircle } from "lucide-react";

interface AdminGenericProps {
  collectionName?: string;
  title?: string;
  description?: string;
  columns?: any[];
}

export function AdminGeneric({ collectionName, title, description, columns }: AdminGenericProps = {}) {
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const moduleName = collectionName || pathParts[pathParts.length - 1];

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({ name: '', description: '', status: 'Active' });
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const formatTitle = (name: string) => {
    switch(name) {
      case 'seo': return 'SEO Manager';
      case 'users': return 'Users & Roles';
      case 'media': return 'Media Library';
      case 'audit-logs': return 'Audit Logs';
      default: return name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' ');
    }
  };

  useEffect(() => {
    fetchData();
  }, [moduleName]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      let targetCollection = moduleName;
      if (['quotations', 'bookings', 'dealers'].includes(moduleName)) {
        targetCollection = 'inquiries';
      }
      
      const data = await getCollection(targetCollection);
      
      // Filter for specific aliases
      let filteredData = data;
      if (moduleName === 'quotations') {
        filteredData = data.filter((item: any) => item.type === 'Quotation Request' || item.type === 'Product Inquiry' || (item.items && item.items.length > 0));
      } else if (moduleName === 'bookings') {
        filteredData = data.filter((item: any) => item.type === 'Showroom Visit' || item.preferredDate);
      } else if (moduleName === 'dealers') {
        filteredData = data.filter((item: any) => item.type === 'Dealership Inquiry' || item.role === 'Dealer');
      }

      // Sort by creation date descending if available
      filteredData.sort((a: any, b: any) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      setItems(filteredData);
    } catch (error) {
      console.error(`Error fetching ${moduleName}:`, error);
      setError(`Failed to load ${moduleName} data.`);
    } finally {
      setLoading(false);
    }
  };

  const getTargetCollection = () => {
    return ['quotations', 'bookings', 'dealers'].includes(moduleName) ? 'inquiries' : moduleName;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const targetCollection = getTargetCollection();
      let savePayload = { ...formData };
      
      // Add type tag for aliased creation
      if (!editingItem && ['quotations', 'bookings', 'dealers'].includes(moduleName)) {
        if (moduleName === 'quotations') savePayload.type = 'Quotation Request';
        if (moduleName === 'bookings') savePayload.type = 'Showroom Visit';
        if (moduleName === 'dealers') savePayload.type = 'Dealership Inquiry';
      }

      if (editingItem) {
        await updateDocument(targetCollection, editingItem.id, savePayload);
      } else {
        await createDocument(targetCollection, { ...savePayload, createdAt: new Date().toISOString() });
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({ name: '', description: '', status: 'Active' });
      fetchData();
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data. Please check permissions.');
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(`Are you sure you want to delete this record?`)) {
      try {
        const targetCollection = getTargetCollection();
        await deleteDocument(targetCollection, id);
        fetchData();
      } catch (error) {
        console.error('Error deleting data:', error);
        alert('Failed to delete the record.');
      }
    }
  };

  const filteredItems = items.filter(item => {
    const searchLower = search.toLowerCase();
    const nameMatch = item.name && item.name.toLowerCase().includes(searchLower);
    const descMatch = item.description && item.description.toLowerCase().includes(searchLower);
    const emailMatch = item.email && item.email.toLowerCase().includes(searchLower);
    const titleMatch = item.title && item.title.toLowerCase().includes(searchLower);
    return nameMatch || descMatch || emailMatch || titleMatch;
  });

  // Extract all unique keys from all items to render generic columns if needed, but we'll stick to a standard view for simplicity.
  const displayValue = (val: any) => {
    if (typeof val === 'string' && val.length > 50) return val.substring(0, 50) + '...';
    if (typeof val === 'object') return JSON.stringify(val).substring(0, 30) + '...';
    return String(val);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">{title || formatTitle(moduleName)}</h1>
          <p className="text-stone-500">{description || `Manage data for ${formatTitle(moduleName).toLowerCase()}.`}</p>
        </div>
        <button 
          onClick={() => {
            setEditingItem(null);
            setFormData({ name: '', description: '', status: 'Active' });
            setIsModalOpen(true);
          }}
          className="bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-secondary transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Add New
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-stone-50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
            <input
              type="text"
              placeholder={`Search ${formatTitle(moduleName)}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-stone-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none text-sm"
            />
          </div>
          <div className="text-sm text-stone-500">
            Total Records: {items.length}
          </div>
        </div>

        {error ? (
          <div className="p-8 text-center text-red-500 flex flex-col items-center">
            <AlertCircle size={32} className="mb-2 opacity-50" />
            <p>{error}</p>
          </div>
        ) : loading ? (
          <div className="p-8 text-center text-stone-500">Loading {formatTitle(moduleName)}...</div>
        ) : items.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 mb-4">
              <Database size={24} />
            </div>
            <h3 className="text-lg font-bold text-stone-800 mb-1">No Records Found</h3>
            <p className="text-stone-500 max-w-sm mx-auto mb-6">
              The {formatTitle(moduleName)} database is currently empty.
            </p>
            <button 
              onClick={() => {
                setEditingItem(null);
                setFormData({ name: '', description: '', status: 'Active' });
                setIsModalOpen(true);
              }}
              className="text-brand-primary hover:text-brand-secondary font-medium"
            >
              + Create your first record
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
                <tr>
                  {columns ? (
                    <>
                      {columns.slice(0, 4).map((col) => (
                        <th key={col.key} className="px-6 py-3 font-semibold">{col.label}</th>
                      ))}
                      <th className="px-6 py-3 font-semibold">Date Created</th>
                      <th className="px-6 py-3 font-semibold text-right">Actions</th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-3 font-semibold">Primary Reference</th>
                      <th className="px-6 py-3 font-semibold">Details</th>
                      <th className="px-6 py-3 font-semibold">Status</th>
                      <th className="px-6 py-3 font-semibold">Date Created</th>
                      <th className="px-6 py-3 font-semibold text-right">Actions</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50 transition-colors">
                    {columns ? (
                      <>
                        {columns.slice(0, 4).map((col) => (
                          <td key={col.key} className="px-6 py-4 text-stone-600 truncate max-w-[200px]">
                            {item[col.key] || '-'}
                          </td>
                        ))}
                        <td className="px-6 py-4 text-stone-500 text-xs">
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleEdit(item)} className="p-2 text-stone-400 hover:text-brand-primary transition-colors">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="p-2 text-stone-400 hover:text-red-500 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4">
                          <div className="font-bold text-stone-800">
                            {item.name || item.title || item.email || item.clientName || item.id}
                          </div>
                          <div className="text-xs text-stone-400 font-mono mt-1">ID: {item.id.substring(0, 8)}...</div>
                        </td>
                        <td className="px-6 py-4 text-stone-600 max-w-xs truncate">
                          {item.description || item.message || item.content || item.text || '-'}
                        </td>
                        <td className="px-6 py-4">
                          {item.status ? (
                            <span className={`px-2 py-1 text-xs font-bold uppercase rounded ${
                              item.status === 'Active' || item.status === 'Published' ? 'bg-green-100 text-green-700' : 
                              item.status === 'Inactive' || item.status === 'Draft' ? 'bg-red-100 text-red-700' : 
                              'bg-stone-100 text-stone-700'
                            }`}>
                              {item.status}
                            </span>
                          ) : (
                            <span className="text-stone-400 italic text-xs">No Status</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-stone-500 text-xs">
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleEdit(item)} className="p-2 text-stone-400 hover:text-brand-primary transition-colors">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="p-2 text-stone-400 hover:text-red-500 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-stone-100 sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
                <FileText className="text-brand-primary" />
                {editingItem ? `Edit ${formatTitle(moduleName)} Record` : `Add New ${formatTitle(moduleName)} Record`}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {columns ? (
                columns.map((col) => (
                  <div key={col.key}>
                    <label className="block text-sm font-bold text-stone-700 mb-1">
                      {col.label} {col.required && <span className="text-red-500">*</span>}
                    </label>
                    {col.type === 'select' ? (
                      <select
                        required={col.required}
                        value={formData[col.key] || ''}
                        onChange={(e) => setFormData({ ...formData, [col.key]: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                      >
                        <option value="">Select {col.label}</option>
                        {col.options?.map((opt: string) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={col.type === 'number' ? 'number' : 'text'}
                        required={col.required}
                        value={formData[col.key] || ''}
                        onChange={(e) => setFormData({ ...formData, [col.key]: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                        placeholder={`Enter ${col.label.toLowerCase()}`}
                      />
                    )}
                  </div>
                ))
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-1">
                      Name / Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name || formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                      placeholder="Enter primary identifier"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-1">
                      Description / Content
                    </label>
                    <textarea
                      rows={4}
                      value={formData.description || formData.content || formData.message || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                      placeholder="Enter details..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status || 'Active'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Draft">Draft</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </>
              )}

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-stone-600 font-medium hover:bg-stone-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-brand-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-secondary transition-colors"
                >
                  {editingItem ? 'Save Changes' : 'Create Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
