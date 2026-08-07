import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Upload, Download, MoreVertical, Edit, Trash2, Copy, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getCollection, deleteDocument, createDocument } from '../../../services/db';
import { OptimizedImage } from '../../../components/OptimizedImage';

export function ProductList() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  
  // Filters
  const [filterBrand, setFilterBrand] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getCollection('products');
      setProducts(data);
    } catch (e) {
      console.error("Failed to load products", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDocument('products', id);
      setProducts(products.filter(p => p.id !== id));
      setShowDeleteModal(null);
    } catch (e) {
      console.error("Failed to delete product", e);
      alert('Failed to delete product.');
    }
  };

  const handleDuplicate = async (product: any) => {
    try {
      const { id, ...productData } = product;
      const duplicatedData = {
        ...productData,
        name: `Copy - ${product.name}`,
        sku: `${product.sku}-COPY`,
        status: 'Draft',
        createdAt: new Date().toISOString()
      };
      const newId = await createDocument('products', duplicatedData);
      navigate(`/admin/products/edit/${newId}`);
    } catch (e) {
      console.error("Failed to duplicate product", e);
      alert('Failed to duplicate product.');
    }
  };

  
  const handleExport = () => {
    if (products.length === 0) return alert('No products to export');
    
    // Simple CSV export
    const headers = ['id', 'sku', 'name', 'brand', 'category', 'status', 'finish'];
    const csvContent = [
      headers.join(','),
      ...products.map(p => headers.map(h => `"${(p[h] || '').toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `products-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) return;
    try {
      for (const id of selectedProducts) {
        await deleteDocument('products', id);
      }
      setProducts(products.filter(p => !selectedProducts.includes(p.id)));
      setSelectedProducts([]);
    } catch (e) {
      console.error("Failed to delete products", e);
      alert('Failed to delete some products.');
    }
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(pId => pId !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.collection && p.collection.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.finish && p.finish.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesBrand = filterBrand ? p.brand === filterBrand : true;
    const matchesCategory = filterCategory ? p.category === filterCategory : true;
    const matchesStatus = filterStatus ? p.status === filterStatus : true;

    return matchesSearch && matchesBrand && matchesCategory && matchesStatus;
  });

  const uniqueBrands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));
  const uniqueCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-brand-secondary">Product Management</h1>
          <p className="text-stone-500 text-sm">Manage all website products, categories, brands, images and technical documents.</p>
        </div>
        
        <div className="flex gap-2">
          <Link to="/admin/products/import" className="px-4 py-2 border border-stone-200 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-50 flex items-center gap-2 transition-colors">
            <Upload size={16} /> Import
          </Link>
          <button onClick={handleExport} className="px-4 py-2 border border-stone-200 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-50 flex items-center gap-2 transition-colors">
            <Download size={16} /> Export
          </button>
          <Link to="/admin/products/add" className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-secondary flex items-center gap-2 transition-colors">
            <Plus size={16} /> Add New Product
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
              placeholder="Search products..." 
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
            <select 
              className="px-3 py-2 border border-stone-200 rounded-lg text-sm text-stone-600 bg-white"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Draft">Draft</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedProducts.length > 0 && (
          <div className="bg-brand-primary/10 px-4 py-3 border-b border-stone-200 flex justify-between items-center">
            <span className="text-sm font-medium text-brand-secondary">
              {selectedProducts.length} product(s) selected
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
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-6 py-4 font-bold">Product</th>
                <th className="px-6 py-4 font-bold">SKU</th>
                <th className="px-6 py-4 font-bold">Brand & Category</th>
                <th className="px-6 py-4 font-bold">Finish</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-stone-500">
                    <div className="w-8 h-8 border-4 border-stone-200 border-t-brand-primary rounded-full animate-spin mx-auto mb-4"></div>
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-stone-500">
                    No products found matching your criteria.
                  </td>
                </tr>
              ) : filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-stone-50 transition-colors group">
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-stone-300 text-brand-primary focus:ring-brand-primary"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleSelect(product.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-stone-100 border border-stone-200 overflow-hidden flex-shrink-0">
                        {product.mainImage ? (
                          <OptimizedImage src={product.mainImage} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-400 bg-stone-100">
                            No Img
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-stone-800 text-sm">{product.name}</p>
                        {product.collection && <p className="text-xs text-stone-500 mt-0.5">{product.collection}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs font-mono bg-stone-100 px-2 py-1 rounded text-stone-700">{product.sku}</code>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-stone-800">{product.brand || '-'}</div>
                    <div className="text-xs text-stone-500 mt-0.5">{product.category || '-'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-stone-600">{product.finish || '-'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 text-[10px] font-bold uppercase rounded ${
                      product.status === 'Available' ? 'bg-green-100 text-green-700' : 
                      product.status === 'Draft' ? 'bg-stone-100 text-stone-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {product.status || 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleDuplicate(product)}
                        className="p-1.5 text-stone-400 hover:text-brand-primary hover:bg-stone-100 rounded transition-colors"
                        title="Duplicate"
                      >
                        <Copy size={16} />
                      </button>
                      <Link 
                        to={`/admin/products/edit/${product.id}`}
                        className="p-1.5 text-stone-400 hover:text-brand-primary hover:bg-stone-100 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </Link>
                      <button 
                        onClick={() => setShowDeleteModal(product.id)}
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
                Are you sure you want to delete this product? This action cannot be undone and will remove it from all website listings.
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
                  Delete Product
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
