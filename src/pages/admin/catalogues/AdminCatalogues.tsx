import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Upload, Download, Edit, Trash2, Copy, AlertCircle, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getCollection, deleteDocument, createDocument } from '../../../services/db';

export function AdminCatalogues() {
  const [catalogues, setCatalogues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatalogues, setSelectedCatalogues] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  
  // Filters
  const [filterBrand, setFilterBrand] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    loadCatalogues();
  }, []);

  const loadCatalogues = async () => {
    try {
      setLoading(true);
      const data = await getCollection('catalogues');
      setCatalogues(data);
    } catch (e) {
      console.error("Failed to load catalogues", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDocument('catalogues', id);
      setCatalogues(catalogues.filter(c => c.id !== id));
      setShowDeleteModal(null);
    } catch (e) {
      console.error("Failed to delete catalogue", e);
      alert('Failed to delete catalogue.');
    }
  };

  const handleDuplicate = async (catalogue: any) => {
    try {
      const { id, ...catalogueData } = catalogue;
      const duplicatedData = {
        ...catalogueData,
        title: `Copy - ${catalogue.title}`,
        createdAt: new Date().toISOString()
      };
      const newId = await createDocument('catalogues', duplicatedData);
      navigate(`/admin/catalogues/edit/${newId}`);
    } catch (e) {
      console.error("Failed to duplicate catalogue", e);
      alert('Failed to duplicate catalogue.');
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedCatalogues.length} catalogues?`)) return;
    try {
      for (const id of selectedCatalogues) {
        await deleteDocument('catalogues', id);
      }
      setCatalogues(catalogues.filter(c => !selectedCatalogues.includes(c.id)));
      setSelectedCatalogues([]);
    } catch (e) {
      console.error("Failed to delete catalogues", e);
      alert('Failed to delete some catalogues.');
    }
  };

  const toggleSelectAll = () => {
    if (selectedCatalogues.length === filteredCatalogues.length) {
      setSelectedCatalogues([]);
    } else {
      setSelectedCatalogues(filteredCatalogues.map(c => c.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedCatalogues.includes(id)) {
      setSelectedCatalogues(selectedCatalogues.filter(cId => cId !== id));
    } else {
      setSelectedCatalogues([...selectedCatalogues, id]);
    }
  };

  const filteredCatalogues = catalogues.filter(c => {
    const matchesSearch = 
      (c.title && c.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.brand && c.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.category && c.category.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesBrand = filterBrand ? c.brand === filterBrand : true;
    const matchesCategory = filterCategory ? c.category === filterCategory : true;

    return matchesSearch && matchesBrand && matchesCategory;
  });

  const uniqueBrands = Array.from(new Set(catalogues.map(c => c.brand).filter(Boolean)));
  const uniqueCategories = Array.from(new Set(catalogues.map(c => c.category).filter(Boolean)));
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-brand-secondary">Catalogue Management</h1>
          <p className="text-stone-500 text-sm">Manage all downloadable PDF catalogues, brochures, and price lists.</p>
        </div>
        
        <div className="flex gap-2">
          <Link to="/admin/catalogues/import" className="px-4 py-2 border border-stone-200 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-50 flex items-center gap-2 transition-colors">
            <Upload size={16} /> Bulk Upload
          </Link>
          <Link to="/admin/catalogues/add" className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-secondary flex items-center gap-2 transition-colors">
            <Plus size={16} /> Add Catalogue
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-stone-200 bg-stone-50 flex flex-col lg:flex-row gap-4 justify-between items-center">
          <div className="relative w-full lg:w-96">
            <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-stone-400" size={18} />
            <input 
              type="text" 
              placeholder="Search catalogues..." 
              className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            <select 
              className="px-3 py-2 border border-stone-200 rounded-lg text-sm text-stone-600 bg-white"
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
            >
              <option value="">All Brands</option>
              {uniqueBrands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <select 
              className="px-3 py-2 border border-stone-200 rounded-lg text-sm text-stone-600 bg-white"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedCatalogues.length > 0 && (
          <div className="bg-brand-primary/10 px-4 py-3 border-b border-stone-200 flex justify-between items-center">
            <span className="text-sm font-medium text-brand-secondary">
              {selectedCatalogues.length} catalogue(s) selected
            </span>
            <div className="flex gap-2">
              <button 
                onClick={handleBulkDelete}
                className="px-3 py-1.5 bg-red-100 text-red-700 rounded-md text-xs font-bold uppercase tracking-wider hover:bg-red-200 transition-colors"
              >
                Delete Selected
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider border-b border-stone-200">
                <th className="px-6 py-4 w-12">
                  <input 
                    type="checkbox" 
                    className="rounded border-stone-300 text-brand-primary focus:ring-brand-primary"
                    checked={selectedCatalogues.length === filteredCatalogues.length && filteredCatalogues.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-6 py-4 font-bold">Catalogue Details</th>
                <th className="px-6 py-4 font-bold">Brand & Category</th>
                <th className="px-6 py-4 font-bold">Stats</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-stone-500">
                    <div className="w-8 h-8 border-4 border-stone-200 border-t-brand-primary rounded-full animate-spin mx-auto mb-4"></div>
                    Loading catalogues...
                  </td>
                </tr>
              ) : filteredCatalogues.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-stone-500">
                    No catalogues found. <Link to="/admin/catalogues/add" className="text-brand-primary hover:underline">Add one now.</Link>
                  </td>
                </tr>
              ) : filteredCatalogues.map((catalogue) => (
                <tr key={catalogue.id} className="hover:bg-stone-50 transition-colors group">
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-stone-300 text-brand-primary focus:ring-brand-primary"
                      checked={selectedCatalogues.includes(catalogue.id)}
                      onChange={() => toggleSelect(catalogue.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 rounded border border-stone-200 overflow-hidden flex-shrink-0 bg-stone-100 flex items-center justify-center">
                        {catalogue.thumbnail ? (
                          <img src={catalogue.thumbnail} alt={catalogue.title} className="w-full h-full object-cover" />
                        ) : (
                          <FileText className="text-stone-400" size={24} />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-stone-800 text-sm mb-1">{catalogue.title}</p>
                        <div className="flex items-center gap-2 text-xs text-stone-500">
                          {catalogue.year && <span>{catalogue.year}</span>}
                          {catalogue.language && (
                            <>
                              <span className="w-1 h-1 bg-stone-300 rounded-full" />
                              <span>{catalogue.language}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-stone-800">{catalogue.brand || '-'}</div>
                    <div className="text-xs text-stone-500 mt-0.5">
                      {catalogue.category || '-'} {catalogue.productType && `• ${catalogue.productType}`}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-xs text-stone-600">
                      {catalogue.pages && <span>{catalogue.pages} Pages</span>}
                      {catalogue.fileSize && <span>{catalogue.fileSize}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {catalogue.pdfUrl && (
                        <a 
                          href={catalogue.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-stone-400 hover:text-brand-primary hover:bg-stone-100 rounded transition-colors"
                          title="View PDF"
                        >
                          <FileText size={16} />
                        </a>
                      )}
                      <button 
                        onClick={() => handleDuplicate(catalogue)}
                        className="p-1.5 text-stone-400 hover:text-brand-primary hover:bg-stone-100 rounded transition-colors"
                        title="Duplicate"
                      >
                        <Copy size={16} />
                      </button>
                      <Link 
                        to={`/admin/catalogues/edit/${catalogue.id}`}
                        className="p-1.5 text-stone-400 hover:text-brand-primary hover:bg-stone-100 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </Link>
                      <button 
                        onClick={() => setShowDeleteModal(catalogue.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
            >
              <div className="flex items-center gap-4 mb-4 text-red-600">
                <AlertCircle size={24} />
                <h3 className="text-lg font-bold">Confirm Deletion</h3>
              </div>
              <p className="text-stone-600 mb-6">
                Are you sure you want to delete this catalogue? This action cannot be undone and will remove it from the public library.
              </p>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setShowDeleteModal(null)}
                  className="px-4 py-2 border border-stone-200 text-stone-600 rounded-lg hover:bg-stone-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleDelete(showDeleteModal)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                >
                  Delete Catalogue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
