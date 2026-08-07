import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { SEO } from '../components/SEO';
import { OptimizedImage } from '../components/OptimizedImage';
import { getBrandBySlug, CATEGORIES_DATA } from '../data';
import { getCollection } from '../services/db';
import { ArrowRight, MessageSquare, FileText, Filter, X, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { Product } from '../types';

import { NotFoundPage } from './NotFoundPage';

export function BrandDetail() {
  const { brandSlug } = useParams<{ brandSlug: string }>();
  const brand = getBrandBySlug(brandSlug || '');
  const [allProducts, setAllProducts] = useState<any[]>([]);
  
  useEffect(() => {
    async function fetchProducts() {
      if (!brand) return;
      try {
        const data = await getCollection('products');
        const active = data.filter((p: any) => p.status !== 'Draft' && (p.brandId === brand.id || p.brand === brand.name));
        setAllProducts(active);
      } catch (e) {
        console.error(e);
      }
    }
    fetchProducts();
  }, [brand]);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFinish, setSelectedFinish] = useState<string>('all');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!brand) {
    return <NotFoundPage />;
  }

  // Derive categories for this brand based on its products
  const brandCategoryIds = Array.from(new Set(allProducts.map(p => p.categoryId)));
  const brandCategories = CATEGORIES_DATA.filter(c => brandCategoryIds.includes(c.id));
  
  // Derive available finishes for this brand
  const brandFinishes = Array.from(new Set(allProducts.flatMap(p => p.finish || [])));

  // Filter products
  const filteredProducts = allProducts.filter(p => {
    const matchCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchFinish = selectedFinish === 'all' || (p.finish && p.finish.includes(selectedFinish));
    const matchSearch = (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
                        (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase())) || 
                        (p.series && p.series.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchFinish && matchSearch;
  });

  return (
    <div className="flex-grow flex flex-col bg-stone-50 overflow-hidden">
      <SEO 
        title={brand.seoTitle}
        description={brand.seoDescription}
        keywords={[`${brand.name} UAE`, `${brand.name} Dubai`, "Bathroom fittings", "Mixers"]}
      />

      {/* SECTION 1: Brand Hero Banner */}
      <section className="relative min-h-[60vh] flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <OptimizedImage 
            src={brand.banner} 
            alt={brand.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 via-stone-900/60 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl inline-block mb-8 border border-white/20">
              <OptimizedImage src={brand.logo} alt={`${brand.name} Logo`} className="h-12 w-auto object-contain bg-white rounded-xl p-2" fallbackSrc={`https://via.placeholder.com/150x50?text=${brand.name}`} />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold font-display text-white mb-4">
              {brand.name}
            </h1>
            <p className="text-sm font-bold uppercase tracking-widest text-brand-primary mb-6">
              Origin: {brand.country}
            </p>
            <p className="text-lg text-stone-200 leading-relaxed mb-10 font-light">
              {brand.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#products" className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-brand-secondary transition-all hover:shadow-lg hover:-translate-y-1">
                Explore Products <ArrowRight size={18} />
              </a>
              <Link to={`/contact?tab=quote&brand=${brand.slug}`} className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-white hover:text-brand-secondary transition-all hover:shadow-lg hover:-translate-y-1">
                Request Quote <FileText size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: Brand Categories */}
      {brandCategories.length > 0 && (
        <section className="py-20 bg-white border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold font-display text-brand-secondary mb-10 text-center">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {brandCategories.map((cat, idx) => {
                const count = allProducts.filter(p => p.categoryId === cat.id).length;
                return (
                  <button 
                    key={cat.id} 
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="group relative aspect-square overflow-hidden rounded-xl bg-stone-100 text-left"
                  >
                    <OptimizedImage 
                      src={cat.image} 
                      alt={cat.name}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
                      <h3 className="font-bold text-lg text-white group-hover:text-brand-primary transition-colors">{cat.name}</h3>
                      <p className="text-xs text-stone-300 mb-2">{count} Products</p>
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                        View Products <ArrowRight size={12} />
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 3 & 4: Products & Filters */}
      <section id="products" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold font-display text-brand-secondary">
              {brand.name} Collection <span className="text-stone-400 text-lg font-normal">({filteredProducts.length})</span>
            </h2>
            <button 
              className="lg:hidden flex items-center gap-2 bg-white border border-stone-200 px-4 py-2 rounded-lg font-bold text-sm text-stone-700"
              onClick={() => setIsMobileFilterOpen(true)}
            >
              <Filter size={16} /> Filters
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className={`fixed inset-0 z-50 lg:static lg:w-1/4 lg:block ${isMobileFilterOpen ? 'block' : 'hidden'}`}>
              <div className="absolute inset-0 bg-black/50 lg:hidden" onClick={() => setIsMobileFilterOpen(false)} />
              <div className="absolute top-0 right-0 bottom-0 w-4/5 max-w-sm bg-white lg:w-full lg:static lg:bg-transparent p-6 lg:p-0 overflow-y-auto z-10 lg:z-0 lg:border-r lg:border-stone-200 lg:pr-8">
                
                <div className="flex justify-between items-center lg:hidden mb-6">
                  <h3 className="font-bold font-display text-xl text-brand-secondary">Filters</h3>
                  <button onClick={() => setIsMobileFilterOpen(false)}><X size={24} className="text-stone-400" /></button>
                </div>

                <div className="space-y-8">
                  {/* Search */}
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-2"><Search size={16}/> Search SKU / Name</h4>
                    <input 
                      type="text" 
                      placeholder="e.g. IND-100" 
                      className="w-full bg-white border border-stone-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-brand-primary"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Categories */}
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider text-stone-500 mb-3">Categories</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="category" 
                          checked={selectedCategory === 'all'} 
                          onChange={() => setSelectedCategory('all')}
                          className="w-4 h-4 text-brand-primary focus:ring-brand-primary/20 border-stone-300"
                        />
                        <span className="text-sm font-medium text-stone-700 group-hover:text-brand-primary transition-colors">All Categories</span>
                      </label>
                      {brandCategories.map(cat => (
                        <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="radio" 
                            name="category" 
                            checked={selectedCategory === cat.id} 
                            onChange={() => setSelectedCategory(cat.id)}
                            className="w-4 h-4 text-brand-primary focus:ring-brand-primary/20 border-stone-300"
                          />
                          <span className="text-sm font-medium text-stone-700 group-hover:text-brand-primary transition-colors">{cat.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Finishes */}
                  {brandFinishes.length > 0 && (
                    <div>
                      <h4 className="font-bold text-sm uppercase tracking-wider text-stone-500 mb-3">Finishes</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="radio" 
                            name="finish" 
                            checked={selectedFinish === 'all'} 
                            onChange={() => setSelectedFinish('all')}
                            className="w-4 h-4 text-brand-primary focus:ring-brand-primary/20 border-stone-300"
                          />
                          <span className="text-sm font-medium text-stone-700 group-hover:text-brand-primary transition-colors">All Finishes</span>
                        </label>
                        {brandFinishes.map(finish => (
                          <label key={finish} className="flex items-center gap-3 cursor-pointer group">
                            <input 
                              type="radio" 
                              name="finish" 
                              checked={selectedFinish === finish} 
                              onChange={() => setSelectedFinish(finish)}
                              className="w-4 h-4 text-brand-primary focus:ring-brand-primary/20 border-stone-300"
                            />
                            <span className="text-sm font-medium text-stone-700 group-hover:text-brand-primary transition-colors">{finish}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Clear Filters */}
                  {(selectedCategory !== 'all' || selectedFinish !== 'all' || searchQuery !== '') && (
                    <button 
                      onClick={() => {
                        setSelectedCategory('all');
                        setSelectedFinish('all');
                        setSearchQuery('');
                      }}
                      className="w-full py-2 border border-stone-200 rounded-lg text-sm font-bold text-stone-600 hover:bg-stone-50 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="lg:w-3/4">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-white border border-stone-200 rounded-2xl">
                  <SlidersHorizontal size={48} className="mx-auto text-stone-300 mb-4" />
                  <h3 className="text-xl font-bold text-brand-secondary mb-2">No products found</h3>
                  <p className="text-stone-500">Try adjusting your filters to find what you're looking for.</p>
                  <button 
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedFinish('all');
                      setSearchQuery('');
                    }}
                    className="mt-6 inline-flex items-center justify-center gap-2 bg-brand-primary text-white px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-brand-secondary transition-all"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => {
                    const cat = CATEGORIES_DATA.find(c => c.id === product.categoryId);
                    const productUrl = `/products/${brand.slug}/${cat?.slug || 'unknown'}/${product.slug}`;
                    
                    return (
                      <div key={product.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden group flex flex-col hover:shadow-xl transition-all duration-300">
                        <Link to={productUrl} className="aspect-square relative overflow-hidden bg-stone-100 block">
                          <OptimizedImage 
                            src={product.mainImage || product.thumbnail || (product.images && product.images[0]) || 'https://placehold.co/400'} 
                            alt={product.name}
                            className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-all duration-500"
                          />
                          <div className="absolute top-4 left-4 flex flex-col gap-2">
                            <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-brand-secondary shadow-sm">
                              {brand.name}
                            </span>
                          </div>
                          {product.status === 'Coming Soon' && (
                            <div className="absolute top-4 right-4">
                              <span className="bg-brand-secondary text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm">
                                Coming Soon
                              </span>
                            </div>
                          )}
                        </Link>
                        
                        <div className="p-6 flex flex-col flex-grow">
                          <div className="flex justify-between items-start mb-2 gap-2">
                            <Link to={productUrl} className="font-bold text-lg text-brand-secondary group-hover:text-brand-primary transition-colors line-clamp-2">
                              {product.name}
                            </Link>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 text-xs text-stone-500 mb-4 font-medium uppercase tracking-wider">
                            <span className="font-mono bg-stone-100 px-1.5 py-0.5 rounded">{product.sku}</span>
                            <span className="bg-stone-50 border border-stone-100 px-1.5 py-0.5 rounded">{product.collection}</span>
                          </div>
                          
                          <p className="text-sm text-stone-600 line-clamp-2 mb-6 flex-grow">{product.shortDescription}</p>
                          
                          <div className="flex flex-col gap-2 mt-auto">
                            <Link to={productUrl} className="w-full flex items-center justify-center gap-2 bg-stone-100 text-brand-secondary font-bold py-2.5 rounded-lg text-sm hover:bg-stone-200 transition-colors">
                              View Details
                            </Link>
                            <div className="grid grid-cols-2 gap-2">
                              <Link to={`/contact?tab=quote&sku=${product.sku}`} className="flex items-center justify-center gap-1 border border-brand-primary text-brand-primary font-bold py-2 rounded-lg text-xs hover:bg-brand-primary hover:text-white transition-colors">
                                <FileText size={14} /> Quote
                              </Link>
                              <a href={`https://wa.me/971501234567?text=I am interested in ${product.name} (${product.sku})`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1 border border-green-500 text-green-600 font-bold py-2 rounded-lg text-xs hover:bg-green-500 hover:text-white transition-colors">
                                <MessageSquare size={14} /> WhatsApp
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Search(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
