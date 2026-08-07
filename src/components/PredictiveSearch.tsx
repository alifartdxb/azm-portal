import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { OptimizedImage } from './OptimizedImage';
import { getCollection } from '../services/db';

export function PredictiveSearch({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ type: string, title: string, id: string, image?: string, subtitle?: string, link: string }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
    let active = true;
    
    async function performSearch() {
      if (query.length < 2) {
        setResults([]);
        setIsOpen(false);
        setSelectedIndex(-1);
        return;
      }

      setIsSearching(true);
      setIsOpen(true);
      setSelectedIndex(-1);

      try {
        const q = query.toLowerCase();
        
        // Parallel fetch for speed
        const [products, catalogues, blogs] = await Promise.all([
          getCollection('products'),
          getCollection('catalogues'),
          getCollection('blogs')
        ]);

        if (!active) return;

        let globalResults: { type: string, title: string, id: string, image?: string, subtitle?: string, link: string }[] = [];

        // 1. Products
        if (products) {
          const matchedProducts = products.filter((p: any) => 
            p.status !== 'Draft' && (
              (p.name && p.name.toLowerCase().includes(q)) || 
              (p.sku && p.sku.toLowerCase().includes(q)) ||
              (p.brand && p.brand.toLowerCase().includes(q)) ||
              (p.category && p.category.toLowerCase().includes(q))
            )
          ).slice(0, 5); // Limit to 5
          
          matchedProducts.forEach((p: any) => {
            const brandSlug = p.brand?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'brand';
            const categorySlug = p.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'category';
            const itemSlug = p.slug || p.urlSlug || p.sku;
            globalResults.push({
              type: 'Product',
              title: p.name || p.sku,
              id: p.id || p.sku,
              image: p.mainImage || p.thumbnail || (p.images && p.images[0]),
              subtitle: `${p.brand || ''} • ${p.sku || ''}`,
              link: `/products/${brandSlug}/${categorySlug}/${itemSlug}`
            });
          });
        }

        // 2. Catalogues
        if (catalogues) {
          const matchedCatalogues = catalogues.filter((c: any) => 
            (c.title && c.title.toLowerCase().includes(q)) || 
            (c.brand && c.brand.toLowerCase().includes(q)) ||
            (c.category && c.category.toLowerCase().includes(q))
          ).slice(0, 3);
          
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
          ).slice(0, 3);
          
          matchedBlogs.forEach((b: any) => {
            globalResults.push({
              type: 'Blog',
              title: b.title,
              id: b.id,
              image: b.coverImage,
              subtitle: b.category,
              link: `/news/${b.slug || b.id}`
            });
          });
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
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      const item = results[selectedIndex];
      if (item) {
        navigate(item.link);
        setIsOpen(false);
        setQuery('');
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
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
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search products, catalogues, blogs..."
          aria-label="Search"
          className={`w-full pl-12 pr-12 py-3 rounded-full focus:outline-none transition-all shadow-sm ${bgClasses} focus:ring-2 focus:ring-brand-primary/20`}
        />
        {isSearching && (
          <Loader2 className={`absolute right-4 top-1/2 -translate-y-1/2 animate-spin ${variant === 'dark' ? 'text-white' : 'text-brand-primary'}`} size={18} />
        )}
      </div>

      <AnimatePresence>
        {isOpen && query.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-stone-100 overflow-hidden max-h-[70vh] flex flex-col"
          >
            {results.length > 0 ? (
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
                                {item.title}
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
                <p className="text-stone-500 font-medium">No results found for "{query}"</p>
                <p className="text-sm text-stone-400 mt-2">Try different keywords</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
