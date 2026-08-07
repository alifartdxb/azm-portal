import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CATEGORIES_DATA, BRANDS_DATA, PRODUCTS_DATA } from "../data";
import { ArrowRight, SlidersHorizontal, ChevronRight, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SEO } from "../components/SEO";
import { OptimizedImage } from "../components/OptimizedImage";
import { getCollection } from "../services/db";

export function Products() {
  const [searchParams] = useSearchParams();
  const urlCategory = searchParams.get('category');
  
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(urlCategory ? [urlCategory] : []);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("Newest");
  const [products, setProducts] = useState<any[]>([]);
  const [dbBrands, setDbBrands] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const [data, bData, cData] = await Promise.all([
          getCollection('products'),
          getCollection('brands'),
          getCollection('categories')
        ]);
        setDbBrands(bData);
        setDbCategories(cData);
        
        // Filter out drafts on public site
        const activeProducts = data.filter((p: any) => p.status !== 'Draft');
        
        if (activeProducts.length > 0) {
          setProducts(activeProducts);
        } else {
          setProducts(PRODUCTS_DATA); // Fallback
        }
      } catch (e) {
        console.error("Failed to load products from DB", e);
        setProducts(PRODUCTS_DATA);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Extract unique filter options
  
  // Helper to extract unique non-empty values
  const getUniqueValues = (key: string) => {
    return Array.from(new Set(products.map(p => p[key]).filter(Boolean))) as string[];
  };
  
  const allFinishes = Array.from(new Set(products.flatMap(p => p.finish ? (Array.isArray(p.finish) ? p.finish : [p.finish]) : []))) as string[];
  const allCollections = getUniqueValues('collection');
  const allSeries = getUniqueValues('series');
  const allColors = getUniqueValues('color');
  const allMaterials = getUniqueValues('material');
  const allCountries = getUniqueValues('country');
  const allAvailability = getUniqueValues('status');


  const toggleFilter = (list: string[], setList: (l: string[]) => void, value: string) => {
    if (list.includes(value)) {
      setList(list.filter(item => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedFinishes([]);
    setSelectedCollections([]);
    setSelectedSeries([]);
    setSelectedColors([]);
    setSelectedMaterials([]);
    setSelectedAvailability([]);
    setSelectedCountries([]);
    setSearchQuery("");
  };

  const filteredProducts = useMemo(() => {
    let result = products;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) || 
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.series && p.series.toLowerCase().includes(q))
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter(p => 
        selectedCategories.includes(p.categoryId) || 
        selectedCategories.includes(p.category) // Support new db schema
      );
    }

    if (selectedBrands.length > 0) {
      result = result.filter(p => 
        selectedBrands.includes(p.brandId) ||
        selectedBrands.includes(p.brand) // Support new db schema
      );
    }

    if (selectedFinishes.length > 0) {
      result = result.filter(p => p.finish && (
        (Array.isArray(p.finish) && p.finish.some(f => selectedFinishes.includes(f))) ||
        (typeof p.finish === 'string' && selectedFinishes.includes(p.finish))
      ));
    }

    
    if (selectedCollections.length > 0) {
      result = result.filter(p => selectedCollections.includes(p.collection));
    }
    if (selectedSeries.length > 0) {
      result = result.filter(p => selectedSeries.includes(p.series));
    }
    if (selectedColors.length > 0) {
      result = result.filter(p => p.color && (
        (Array.isArray(p.color) && p.color.some(f => selectedColors.includes(f))) ||
        (typeof p.color === 'string' && selectedColors.includes(p.color))
      ));
    }
    if (selectedMaterials.length > 0) {
      result = result.filter(p => p.material && selectedMaterials.includes(p.material));
    }
    if (selectedAvailability.length > 0) {
      result = result.filter(p => p.status && selectedAvailability.includes(p.status));
    }
    if (selectedCountries.length > 0) {
      // Assuming countries logic via brand country (not easy to filter dynamically if brand country isn't on product, skipping for now or matching product.country)
      result = result.filter(p => p.country && selectedCountries.includes(p.country));
    }
    
    // Sorting
    if (sortBy === 'A-Z') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sortBy === 'Z-A') {
      result.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    } else if (sortBy === 'Newest') {
      result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    } else if (sortBy === 'Most Popular' || sortBy === 'Featured') {
      // Assuming featured flag
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [searchQuery, selectedCategories, selectedBrands, selectedFinishes, selectedCollections, selectedSeries, selectedColors, selectedMaterials, selectedAvailability, selectedCountries, sortBy, products]);

  return (
    <div className="flex-grow flex flex-col bg-stone-50">
      <SEO 
        title="Product Catalogue | AZM Group"
        description="Browse our extensive catalogue of premium bathroom and kitchen solutions."
        keywords={["Catalogue", "Bathroom Products", "Kitchen Sinks", "Mixers", "Showers"]}
      />

      <div className="pt-24 pb-4 border-b border-stone-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex text-xs font-bold uppercase tracking-wider text-stone-500 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-brand-primary transition-colors">Home</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-brand-secondary">All Products</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-8 items-start w-full">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden w-full flex justify-between items-center bg-white p-4 rounded-xl border border-stone-200">
          <span className="font-bold text-brand-secondary">Showing {filteredProducts.length} Results</span>
          <button 
            onClick={() => setIsMobileFiltersOpen(true)}
            className="flex items-center gap-2 bg-stone-100 text-stone-700 px-4 py-2 rounded-lg font-bold text-sm"
          >
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>

        {/* Sidebar Filters */}
        <AnimatePresence>
          {(isMobileFiltersOpen || window.innerWidth >= 1024) && (
            <motion.div 
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className={`fixed inset-y-0 left-0 z-50 w-4/5 max-w-sm bg-white p-6 overflow-y-auto shadow-2xl lg:static lg:w-1/4 lg:max-w-none lg:bg-transparent lg:p-0 lg:shadow-none lg:block lg:flex-shrink-0 ${isMobileFiltersOpen ? 'block' : 'hidden'}`}
            >
              <div className="flex justify-between items-center mb-8 lg:hidden">
                <h3 className="font-bold font-display text-2xl text-brand-secondary">Filters</h3>
                <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 text-stone-400 bg-stone-100 rounded-full"><X size={20} /></button>
              </div>

              <div className="space-y-8 lg:sticky lg:top-32">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-stone-500 mb-4 flex items-center gap-2"><Search size={16} /> Search</h4>
                  <input 
                    type="text" 
                    placeholder="Search SKU or Name..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  />
                </div>

                
                <FilterSection title="Brands" options={dbBrands.length > 0 ? dbBrands.map(b => ({id: b.id, name: b.name})) : BRANDS_DATA.map(b => ({id: b.id, name: b.name}))} selected={selectedBrands} toggle={(val) => toggleFilter(selectedBrands, setSelectedBrands, val)} />
                <FilterSection title="Categories" options={dbCategories.length > 0 ? dbCategories.map(c => ({id: c.id, name: c.name})) : CATEGORIES_DATA.map(c => ({id: c.id, name: c.name}))} selected={selectedCategories} toggle={(val) => toggleFilter(selectedCategories, setSelectedCategories, val)} />
                <FilterSection title="Collections" options={allCollections.map(f => ({id: f, name: f}))} selected={selectedCollections} toggle={(val) => toggleFilter(selectedCollections, setSelectedCollections, val)} />
                <FilterSection title="Series" options={allSeries.map(f => ({id: f, name: f}))} selected={selectedSeries} toggle={(val) => toggleFilter(selectedSeries, setSelectedSeries, val)} />
                <FilterSection title="Finishes" options={allFinishes.map(f => ({id: f, name: f}))} selected={selectedFinishes} toggle={(val) => toggleFilter(selectedFinishes, setSelectedFinishes, val)} />
                <FilterSection title="Colors" options={allColors.map(f => ({id: f, name: f}))} selected={selectedColors} toggle={(val) => toggleFilter(selectedColors, setSelectedColors, val)} />
                <FilterSection title="Materials" options={allMaterials.map(f => ({id: f, name: f}))} selected={selectedMaterials} toggle={(val) => toggleFilter(selectedMaterials, setSelectedMaterials, val)} />
                <FilterSection title="Availability" options={allAvailability.map(f => ({id: f, name: f}))} selected={selectedAvailability} toggle={(val) => toggleFilter(selectedAvailability, setSelectedAvailability, val)} />
                <FilterSection title="Country of Origin" options={allCountries.map(f => ({id: f, name: f}))} selected={selectedCountries} toggle={(val) => toggleFilter(selectedCountries, setSelectedCountries, val)} />


                <button 
                  onClick={clearAllFilters}
                  className="w-full py-3 bg-stone-100 text-stone-600 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-stone-200 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Backdrop for mobile */}
        {isMobileFiltersOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileFiltersOpen(false)} />
        )}

        {/* Product Grid */}
        <div className="w-full lg:w-3/4">
          <div className="hidden lg:flex justify-between items-center mb-8 bg-white p-4 rounded-xl border border-stone-200">
            <h1 className="text-2xl font-bold font-display text-brand-secondary">
              Product Catalogue
              <span className="ml-3 text-sm font-normal text-stone-400 bg-stone-100 px-3 py-1 rounded-full">Showing {filteredProducts.length} of {products.length} Products</span>
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold uppercase tracking-wider text-stone-500">Sort By:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded-lg px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-brand-primary"
              >
                <option value="Newest">Newest</option>
                <option value="A-Z">A-Z</option>
                <option value="Z-A">Z-A</option>
                <option value="Featured">Featured</option>
                <option value="Brand">Brand</option>
                <option value="Most Viewed">Most Viewed</option>
              </select>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-16 text-center">
              <Search size={48} className="mx-auto text-stone-200 mb-6" />
              <h3 className="text-2xl font-bold font-display text-brand-secondary mb-2">No products found</h3>
              <p className="text-stone-500 max-w-md mx-auto mb-8">We couldn't find any products matching your current filters. Try adjusting your criteria or clear all filters.</p>
              <button onClick={clearAllFilters} className="inline-flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-brand-secondary transition-colors">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map(product => {
                const brand = dbBrands.find((b:any) => b.id === product.brandId || b.name === product.brand) || BRANDS_DATA.find(b => b.id === product.brandId || b.name === product.brand);
                const category = dbCategories.find((c:any) => c.id === product.categoryId || c.name === product.category) || CATEGORIES_DATA.find(c => c.id === product.categoryId || c.name === product.category);
                
                return (
                  <Link 
                    key={product.id || product.sku} 
                    to={`/products/${brand?.slug || product.brand?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'brand'}/${category?.slug || product.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'category'}/${product.slug || product.urlSlug || product.sku}`}
                    className="group bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
                  >
                    <div className="aspect-square relative overflow-hidden bg-stone-50 p-6 flex items-center justify-center">
                      <OptimizedImage 
                        src={product.mainImage || product.thumbnail || product.images?.[0]} 
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-brand-secondary px-2 py-1 rounded shadow-sm">
                          {brand?.name || product.brand}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="font-bold text-lg text-brand-secondary mb-1 group-hover:text-brand-primary transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="font-mono text-xs text-stone-400 mb-4">{product.sku}</p>
                      
                      <div className="mt-auto pt-4 border-t border-stone-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">{category?.name || product.category}</span>
                        <ArrowRight size={16} className="text-brand-primary opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterSection({ title, options, selected, toggle }: { title: string, options: {id: string, name: string}[], selected: string[], toggle: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(true);

  if (options.length === 0) return null;

  return (
    <div className="border-b border-stone-200 pb-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left font-bold text-sm uppercase tracking-widest text-brand-secondary mb-4"
      >
        {title}
        <ChevronRight size={16} className={`transform transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 pt-2">
              {options.map((opt) => (
                <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selected.includes(opt.id) ? 'bg-brand-primary border-brand-primary text-white' : 'border-stone-300 group-hover:border-brand-primary'}`}>
                    {selected.includes(opt.id) && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                  </div>
                  <span className={`text-sm ${selected.includes(opt.id) ? 'font-bold text-brand-secondary' : 'text-stone-600 group-hover:text-brand-primary transition-colors'}`}>{opt.name}</span>
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
