import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getCollection } from '../services/db';
import { OptimizedImage } from '../components/OptimizedImage';
import { Trash2, Plus, ArrowRight, Share2, Printer, MessageCircle } from 'lucide-react';
import { useInquiry } from '../contexts/InquiryContext';

export function ProductComparison() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  const { addItem } = useInquiry();

  const ids = searchParams.get('ids')?.split(',').filter(Boolean) || [];

  useEffect(() => {
    async function load() {
      try {
        const data = await getCollection('products');
        setAllProducts(data.filter((p: any) => p.status !== 'Draft'));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (allProducts.length > 0) {
      const selected = ids.map(id => allProducts.find(p => p.id === id)).filter(Boolean);
      setProducts(selected);
      
      // Auto-add if ?add=id
      const addId = searchParams.get('add');
      if (addId && !ids.includes(addId)) {
        if (selected.length < 4) {
          const newIds = [...ids, addId];
          setSearchParams({ ids: newIds.join(',') });
        }
      }
    }
  }, [allProducts, searchParams]);

  const removeProduct = (id: string) => {
    const newIds = ids.filter(i => i !== id);
    setSearchParams(newIds.length ? { ids: newIds.join(',') } : {});
  };

  const addProduct = (id: string) => {
    if (ids.length < 4 && !ids.includes(id)) {
      setSearchParams({ ids: [...ids, id].join(',') });
    }
    setIsAdding(false);
  };

  const handlePrint = () => {
    window.print();
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Product Comparison',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Determine common category
  const commonCategory = products.length > 0 ? products[0].category : '';
  
  // Dynamic fields based on category
  const getFields = () => {
    const baseFields = [
      { key: 'brand', label: 'Brand' },
      { key: 'category', label: 'Category' },
      { key: 'material', label: 'Material' },
      { key: 'finish', label: 'Finish' },
      { key: 'dimensions', label: 'Dimensions' },
      { key: 'warranty', label: 'Warranty' },
      { key: 'countryOfOrigin', label: 'Country of Origin' }
    ];
    
    if (commonCategory?.toLowerCase().includes('tile')) {
      return [...baseFields, 
        { key: 'thickness', label: 'Thickness' },
        { key: 'slipRating', label: 'Slip Rating' },
        { key: 'application', label: 'Application' }
      ];
    } else if (commonCategory?.toLowerCase().includes('closet')) {
      return [...baseFields,
        { key: 'installationType', label: 'Installation' },
        { key: 'flushType', label: 'Flush Type' },
        { key: 'waterSaving', label: 'Water Saving' }
      ];
    } else if (commonCategory?.toLowerCase().includes('mixer') || commonCategory?.toLowerCase().includes('faucet')) {
      return [...baseFields,
        { key: 'cartridge', label: 'Cartridge' },
        { key: 'flowRate', label: 'Flow Rate' },
        { key: 'pressureRange', label: 'Pressure Range' }
      ];
    }
    
    return baseFields;
  };

  const fields = getFields();

  if (loading) return <div className="min-h-screen pt-32 flex justify-center"><div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="pt-24 pb-24 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-secondary mb-2">Compare Products</h1>
            <p className="text-stone-600">Compare specifications side by side to find the perfect fit.</p>
          </div>
          
          <div className="flex gap-2 print:hidden">
            <button onClick={handleShare} className="p-2 bg-white border border-stone-200 rounded-lg text-stone-600 hover:text-brand-primary transition-colors" title="Share Comparison">
              <Share2 size={20} />
            </button>
            <button onClick={handlePrint} className="p-2 bg-white border border-stone-200 rounded-lg text-stone-600 hover:text-brand-primary transition-colors" title="Print Comparison">
              <Printer size={20} />
            </button>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
            <h2 className="text-xl font-bold text-stone-800 mb-4">No products selected for comparison</h2>
            <p className="text-stone-500 mb-6">Browse our catalog and select products to compare.</p>
            <div className="flex justify-center gap-4">
              <Link to="/products" className="px-6 py-3 bg-stone-900 text-white font-bold rounded-lg hover:bg-brand-primary transition-colors">
                Browse Products
              </Link>
              <Link to="/product-finder" className="px-6 py-3 bg-stone-100 text-stone-800 font-bold rounded-lg hover:bg-stone-200 transition-colors">
                Use Product Finder
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr>
                    <th className="w-48 p-6 bg-stone-50 border-b border-r border-stone-200 align-top">
                      <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-4">Product Details</span>
                      <div className="text-xs text-stone-400">Compare up to 4 products</div>
                    </th>
                    {products.map((p, idx) => {
                      const brandSlug = p.brand?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'brand';
                      const catSlug = p.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'category';
                      const pSlug = p.slug || p.sku || p.id;
                      const link = `/products/${brandSlug}/${catSlug}/${pSlug}`;
                      
                      return (
                      <th key={p.id} className="p-6 bg-white border-b border-r border-stone-200 align-top w-64 relative group">
                        <button 
                          onClick={() => removeProduct(p.id)}
                          className="absolute top-4 right-4 p-1.5 bg-stone-100 text-stone-500 rounded hover:bg-red-100 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 print:hidden"
                          title="Remove"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="aspect-square bg-stone-50 mb-4 rounded-xl overflow-hidden relative">
                          <OptimizedImage src={p.mainImage || p.thumbnail || p.images?.[0]} alt={p.name} className="w-full h-full object-contain mix-blend-multiply p-4" />
                        </div>
                        <p className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-1">{p.brand}</p>
                        <Link to={link} className="block text-sm font-bold text-stone-800 hover:text-brand-primary transition-colors mb-2 line-clamp-2">
                          {p.name || p.sku}
                        </Link>
                        <button 
                          onClick={() => addItem({ id: p.id, name: p.name, sku: p.sku, mainImage: p.mainImage, brand: p.brand })}
                          className="w-full py-2 bg-stone-900 hover:bg-brand-primary text-white text-xs font-bold uppercase tracking-wider rounded transition-colors print:hidden"
                        >
                          Add to Inquiry
                        </button>
                      </th>
                    )})}
                    
                    {products.length < 4 && (
                      <th className="p-6 bg-stone-50 border-b border-stone-200 align-middle text-center w-64 print:hidden">
                        {isAdding ? (
                          <div className="text-left">
                            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">Select Product</h4>
                            <div className="max-h-64 overflow-y-auto border border-stone-200 rounded-lg bg-white">
                              {allProducts.filter(p => !ids.includes(p.id) && (!commonCategory || p.category === commonCategory)).map(p => (
                                <button key={p.id} onClick={() => addProduct(p.id)} className="w-full text-left px-3 py-2 text-xs border-b border-stone-100 hover:bg-stone-50 transition-colors last:border-0">
                                  <span className="font-bold text-stone-800 block truncate">{p.name || p.sku}</span>
                                  <span className="text-stone-400">{p.brand}</span>
                                </button>
                              ))}
                              {allProducts.filter(p => !ids.includes(p.id) && (!commonCategory || p.category === commonCategory)).length === 0 && (
                                <div className="p-3 text-xs text-stone-500 text-center">No more products in this category.</div>
                              )}
                            </div>
                            <button onClick={() => setIsAdding(false)} className="text-xs text-stone-500 mt-2 underline">Cancel</button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setIsAdding(true)}
                            className="w-16 h-16 rounded-full border-2 border-dashed border-stone-300 flex items-center justify-center text-stone-400 hover:text-brand-primary hover:border-brand-primary hover:bg-brand-primary/5 transition-all mx-auto mb-2"
                          >
                            <Plus size={24} />
                          </button>
                        )}
                        {!isAdding && <span className="text-xs font-bold text-stone-500">Add Product</span>}
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {fields.map((field, idx) => (
                    <tr key={field.key} className={idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'}>
                      <td className="p-4 border-r border-stone-200 text-sm font-bold text-stone-600 bg-stone-50/80">
                        {field.label}
                      </td>
                      {products.map(p => {
                        const val = p[field.key];
                        // Highlight differences: if there are multiple products and values differ, maybe bold it? (complex, skipping for now)
                        return (
                          <td key={p.id} className="p-4 border-r border-stone-200 text-sm text-stone-800">
                            {val ? val : <span className="text-stone-300">—</span>}
                          </td>
                        );
                      })}
                      {products.length < 4 && <td className="p-4 bg-stone-50/30 print:hidden"></td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
