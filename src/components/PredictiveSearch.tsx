import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Loader2, ArrowRight, Clock, TrendingUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getCollection } from '../services/db';
import { OptimizedImage } from './OptimizedImage';

interface PredictiveSearchProps {
  variant?: 'light' | 'dark';
}

export function PredictiveSearch({ variant = 'light' }: PredictiveSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const popularSearches = ['Vado Mixers', 'Porcelain Tiles', 'Wash Basins', 'Shower Systems', 'Marble Slabs'];

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const saveRecentSearch = (term: string) => {
    if (!term) return;
    const updated = [term, ...recentSearches.filter(t => t !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setSelectedIndex(-1);
    if (query.length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    let active = true;

    const performSearch = async () => {
      try {
        const [products, catalogues, blogs] = await Promise.all([
          getCollection('products'),
          getCollection('catalogues'),
          getCollection('blogs')
        ]);
        
        if (!active) return;
        
        const q = query.toLowerCase();
        let globalResults: any[] = [];
        
        // 1. Products
        if (products) {
          const matchedProducts = products.filter((p: any) => 
            p.status !== 'Draft' && (
              (p.name && p.name.toLowerCase().includes(q)) || 
              (p.sku && p.sku.toLowerCase().includes(q)) ||
              (p.brand && p.brand.toLowerCase().includes(q)) ||
              (p.category && p.category.toLowerCase().includes(q)) ||
              (p.collection && p.collection.toLowerCase().includes(q)) ||
              (p.application && p.application.toLowerCase().includes(q))
            )
          ).slice(0, 5);
          
          matchedProducts.forEach((p: any) => {
            const brandSlug = p.brand?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'brand';
            const categorySlug = p.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'category';
            const itemSlug = p.slug || p.urlSlug || p.sku || p.id;
            globalResults.push({
              type: 'Product',
              title: p.name || p.sku,
              id: p.id || p.sku,
              image: p.mainImage || p.thumbnail || (p.images && p.images[0]),
              subtitle: `${p.brand || ''} • ${p.category || ''}`,
              link: `/products/${brandSlug}/${categorySlug}/${itemSlug}`
            });
          });
        }
        
        // 2. Catalogues
        if (catalogues) {
          const matchedCatalogues = catalogues.filter((c: any) => 
            c.status === 'Published' && (
            (c.title && c.title.toLowerCase().includes(q)) || 
            (c.brand && c.brand.toLowerCase().includes(q)) ||
            (c.category && c.category.toLowerCase().includes(q)))
          ).slice(0, 2);
          
          matchedCatalogues.forEach((c: any) => {
            globalResults.push({
              type: 'Catalogue',
              title: c.title,
              id: c.id,
              image: c.thumbnail,
              subtitle: c.brand,
              link: `/catalogues`
            });
          });
        }
        
        // 3. Blogs
        if (blogs) {
          const matchedBlogs = blogs.filter((b: any) => 
            b.status === 'Published' && (
              (b.title && b.title.toLowerCase().includes(q)) || 
              (b.excerpt && b.excerpt.toLowerCase().includes(q)) ||
              (b.category && b.category.toLowerCase().includes(q))
            )
          ).slice(0, 2);
          
          matchedBlogs.forEach((b: any) => {
            globalResults.push({
              type: 'Blog',
              title: b.title,
              id: b.id,
              image: b.coverImage,
              subtitle: b.category,
              link: `/blog/${b.slug || b.id}`
            });
          });
        }
        
        // Zero-result tracking
        if (globalResults.length === 0) {
          console.log(`[Analytics] Zero results for search: "${query}"`);
          // Could save this to db
        }
        
        setResults(globalResults);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        if (active) setIsSearching(false);
      }
    }

    const debounceId = setTimeout(performSearch, 300);
    return () => {
      active = false;
      clearTimeout(debounceId);
    };
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        saveRecentSearch(query);
        navigate(results[selectedIndex].link);
        setIsOpen(false);
        setQuery('');
      } else if (query) {
        saveRecentSearch(query);
        navigate(`/products?q=${encodeURIComponent(query)}`);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleRecentSearchClick = (term: string) => {
    setQuery(term);
    saveRecentSearch(term);
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === highlight.toLowerCase() ? 
        <span key={index} className="bg-brand-primary/20 text-brand-primary">{part}</span> : part
    );
  };

  const bgClasses = variant === 'dark' 
    ? "bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/60 focus:bg-white/20" 
    : "bg-white border border-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-brand-primary";

  return (
    <div ref={wrapperRef} className="relative w-full z-50">
      <div className="relative">
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${variant === 'dark' ? 'text-white/60' : 'text-stone-400'}`} size={18} />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onClick={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Intelligent Search (Products, Brands, SKUs...)"
          aria-label="Search"
          className={`w-full pl-12 pr-12 py-3 rounded-full focus:outline-none transition-all shadow-sm ${bgClasses} focus:ring-2 focus:ring-brand-primary/20`}
        />
        {isSearching && (
          <Loader2 className={`absolute right-4 top-1/2 -translate-y-1/2 animate-spin ${variant === 'dark' ? 'text-white' : 'text-brand-primary'}`} size={18} />
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-stone-100 overflow-hidden max-h-[70vh] flex flex-col"
          >
            {!query ? (
              <div className="p-6 overflow-y-auto">
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <TrendingUp size={14} /> Popular Searches
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map(term => (
                      <button 
                        key={term}
                        onClick={() => handleRecentSearchClick(term)}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg text-sm transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
                
                {recentSearches.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Clock size={14} /> Recent Searches
                    </h4>
                    <div className="space-y-1">
                      {recentSearches.map(term => (
                        <button 
                          key={term}
                          onClick={() => handleRecentSearchClick(term)}
                          className="w-full text-left px-3 py-2 hover:bg-stone-50 text-stone-600 rounded-lg text-sm transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : results.length > 0 ? (
              <div className="overflow-y-auto">
                {['Product', 'Catalogue', 'Blog'].map(type => {
                  const typeResults = results.filter(r => r.type === type);
                  if (typeResults.length === 0) return null;
                  
                  return (
                    <div key={type}>
                      <div className="px-4 py-2 bg-stone-50 border-y border-stone-100 text-[10px] font-bold uppercase tracking-wider text-stone-500">
                        {type}s
                      </div>
                      {typeResults.map((item) => {
                        const globalIndex = results.indexOf(item);
                        return (
                          <Link
                            key={`${item.type}-${item.id}`}
                            to={item.link}
                            onClick={() => {
                              saveRecentSearch(query);
                              setIsOpen(false);
                              setQuery('');
                            }}
                            className={`flex items-center gap-4 p-4 transition-colors border-b border-stone-50 last:border-0 group ${globalIndex === selectedIndex ? 'bg-stone-100' : 'hover:bg-stone-50'}`}
                          >
                            {item.image && (
                              <div className="w-12 h-12 rounded bg-stone-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                <OptimizedImage src={item.image} alt={item.title} className="w-full h-full object-cover" />
                              </div>
                            )}
                            <div className="flex-grow">
                              <h4 className="text-sm font-bold text-brand-secondary group-hover:text-brand-primary transition-colors line-clamp-1">
                                {highlightText(item.title, query)}
                              </h4>
                              {item.subtitle && (
                                <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 mt-1">
                                  {item.subtitle}
                                </div>
                              )}
                            </div>
                            <ArrowRight size={16} className="text-stone-300 group-hover:text-brand-primary transform group-hover:translate-x-1 transition-all flex-shrink-0" />
                          </Link>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Search size={32} className="mx-auto text-stone-200 mb-4" />
                <p className="text-stone-500 font-medium mb-4">No exact matches found for "{query}"</p>
                <div className="bg-stone-50 rounded-xl p-4 text-left">
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Suggestions</p>
                  <ul className="text-sm text-stone-600 space-y-1">
                    <li>• Check for typos or spelling errors</li>
                    <li>• Use broader search terms</li>
                    <li>• Try searching by brand (e.g. "Jaquar", "Vado")</li>
                    <li>• Or <Link to="/product-finder" className="text-brand-primary font-bold hover:underline" onClick={() => setIsOpen(false)}>try our Product Finder wizard</Link></li>
                  </ul>
                </div>
              </div>
            )}
            
            {query && results.length > 0 && (
              <div className="p-3 bg-stone-50 border-t border-stone-100 text-center">
                <Link 
                  to={`/products?q=${encodeURIComponent(query)}`}
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-bold text-brand-primary uppercase tracking-wider hover:underline"
                >
                  View All Search Results &rarr;
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
