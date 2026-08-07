import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { CATEGORIES_DATA, BRANDS_DATA } from "../data";
import { 
  ArrowRight, SlidersHorizontal, ChevronRight, X, Search, 
  LayoutGrid, List, FileText, Globe
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SEO } from "../components/SEO";
import { OptimizedImage } from "../components/OptimizedImage";
import { getCollection } from "../services/db";
import { FilterSection } from "../components/FilterSection";
import { getProductsFiltered, getProductAggregates, ProductFilterParams } from "../services/productService";
import { DocumentSnapshot } from "firebase/firestore";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [isRtl, setIsRtl] = useState(searchParams.get("lang") === "ar");

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  
  const getArrayParam = (key: string) => {
    const val = searchParams.get(key);
    return val ? val.split(",") : [];
  };

  const [selectedCategories, setSelectedCategories] = useState<string[]>(getArrayParam('category'));
  const [selectedBrands, setSelectedBrands] = useState<string[]>(getArrayParam('brand'));
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>(getArrayParam('finish'));
  const [selectedCollections, setSelectedCollections] = useState<string[]>(getArrayParam('collection'));
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(getArrayParam('material'));
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>(getArrayParam('status'));
  
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || "Recommended");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>((searchParams.get('view') as any) || 'grid');
  
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  const [products, setProducts] = useState<any[]>([]);
  const [dbBrands, setDbBrands] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  
  const PAGE_SIZE = 12;

  const [filterOptions, setFilterOptions] = useState({
    categories: [] as {id: string, name: string, nameAr?: string}[],
    brands: [] as {id: string, name: string, nameAr?: string}[],
    collections: [] as string[],
    materials: [] as string[],
    finishes: [] as string[],
    availability: [] as string[]
  });

  useEffect(() => {
    async function loadMetadata() {
      try {
        const [bData, cData, aggs] = await Promise.all([
          getCollection('brands'),
          getCollection('categories'),
          getProductAggregates()
        ]);
        setDbBrands(bData.length > 0 ? bData : BRANDS_DATA);
        setDbCategories(cData.length > 0 ? cData : CATEGORIES_DATA);
        
        setFilterOptions({
          categories: (cData.length > 0 ? cData : CATEGORIES_DATA).map((c: any) => ({ id: c.id, name: c.name, nameAr: c.nameAr })),
          brands: (bData.length > 0 ? bData : BRANDS_DATA).map((b: any) => ({ id: b.id, name: b.name, nameAr: b.nameAr })),
          collections: aggs.collections,
          materials: aggs.materials,
          finishes: aggs.finishes,
          availability: aggs.status
        });
      } catch (e) {
        console.error("Failed to load metadata", e);
      }
    }
    loadMetadata();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearchQuery) params.set("q", debouncedSearchQuery);
    if (selectedCategories.length) params.set("category", selectedCategories.join(","));
    if (selectedBrands.length) params.set("brand", selectedBrands.join(","));
    if (selectedFinishes.length) params.set("finish", selectedFinishes.join(","));
    if (selectedCollections.length) params.set("collection", selectedCollections.join(","));
    if (selectedMaterials.length) params.set("material", selectedMaterials.join(","));
    if (selectedAvailability.length) params.set("status", selectedAvailability.join(","));
    if (sortBy !== "Recommended") params.set("sort", sortBy);
    if (viewMode !== "grid") params.set("view", viewMode);
    if (isRtl) params.set("lang", "ar");
    
    if (searchParams.toString() !== params.toString()) {
      setSearchParams(params, { replace: true });
    }
  }, [debouncedSearchQuery, selectedCategories, selectedBrands, selectedFinishes, selectedCollections, selectedMaterials, selectedAvailability, sortBy, viewMode, isRtl, setSearchParams, searchParams]);

  const fetchProducts = useCallback(async (isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setProducts([]);
      setLastDoc(null);
    }
    
    try {
      const params: ProductFilterParams = {
        categories: selectedCategories,
        brands: selectedBrands,
        collections: selectedCollections,
        materials: selectedMaterials,
        finishes: selectedFinishes,
        status: selectedAvailability,
        searchQuery: debouncedSearchQuery,
        sortBy,
        pageSize: PAGE_SIZE,
        lastDoc: isLoadMore ? lastDoc : null
      };

      const result = await getProductsFiltered(params);
      
      setProducts(prev => isLoadMore ? [...prev, ...result.products] : result.products);
      setLastDoc(result.lastDoc || null);
      setHasMore(result.hasMore);
      setTotalCount(result.totalCount);
    } catch (e) {
      console.error("Failed to load products", e);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [debouncedSearchQuery, selectedCategories, selectedBrands, selectedFinishes, selectedCollections, selectedMaterials, selectedAvailability, sortBy, lastDoc]);

  useEffect(() => {
    fetchProducts(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery, selectedCategories, selectedBrands, selectedFinishes, selectedCollections, selectedMaterials, selectedAvailability, sortBy]);

  const toggleFilter = (list: string[], setList: (l: string[]) => void, value: string) => {
    if (list.includes(value)) setList(list.filter(item => item !== value));
    else setList([...list, value]);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedFinishes([]);
    setSelectedCollections([]);
    setSelectedMaterials([]);
    setSelectedAvailability([]);
    setSearchQuery("");
  };

  const getBrand = (brandId: string, brandName: string) => {
    return dbBrands.find((b:any) => b.id === brandId || b.name === brandName) || 
           BRANDS_DATA.find(b => b.id === brandId || b.name === brandName);
  };
  
  const getCategory = (catId: string, catName: string) => {
    return dbCategories.find((c:any) => c.id === catId || c.name === catName) || 
           CATEGORIES_DATA.find(c => c.id === catId || c.name === catName);
  };

  const activeFilterCount = selectedCategories.length + selectedBrands.length + selectedFinishes.length + 
                            selectedCollections.length + selectedMaterials.length + selectedAvailability.length;

  return (
    <div className={`flex-grow flex flex-col bg-stone-50 overflow-hidden ${isRtl ? 'font-arabic' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <SEO 
        title={isRtl ? "كتالوج المنتجات | AZM Group" : "Product Catalogue | AZM Group"}
        description="Browse our extensive catalogue of premium bathroom solutions, kitchen fittings, tiles, and building materials."
      />
      
      {/* Header */}
      <section className="pt-32 pb-12 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold font-display text-brand-secondary mb-4">
              {isRtl ? 'كتالوج المنتجات' : 'Product Catalogue'}
            </h1>
            <p className="text-lg text-stone-600 max-w-2xl">
              {isRtl ? 'اكتشف مجموعتنا المختارة من المنتجات المعمارية والتجهيزات الفاخرة.' : 'Explore our curated selection of architectural products and premium fittings.'}
            </p>
          </div>
          <button 
            onClick={() => setIsRtl(!isRtl)} 
            className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 px-4 py-2 rounded-full text-sm font-bold transition-colors"
          >
            <Globe size={16} />
            {isRtl ? 'English' : 'العربية'}
          </button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col lg:flex-row gap-8">
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between mb-4 bg-white p-4 rounded-xl border border-stone-200">
          <button 
            onClick={() => setIsMobileFiltersOpen(true)}
            className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider text-brand-secondary"
          >
            <SlidersHorizontal size={18} /> {isRtl ? 'تصفية' : 'Filters'} {activeFilterCount > 0 && <span className="bg-brand-primary text-white text-xs px-2 py-0.5 rounded-full">{activeFilterCount}</span>}
          </button>
          
          <div className="flex items-center gap-2">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-stone-100 text-brand-primary' : 'text-stone-400'}`}>
              <LayoutGrid size={18} />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-stone-100 text-brand-primary' : 'text-stone-400'}`}>
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Filters Sidebar */}
        <AnimatePresence>
          {(isMobileFiltersOpen || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
            <motion.div 
              initial={{ x: isRtl ? 300 : -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isRtl ? 300 : -300, opacity: 0 }}
              className={`
                fixed inset-y-0 ${isRtl ? 'right-0' : 'left-0'} z-50 w-80 bg-white shadow-2xl p-6 overflow-y-auto
                lg:relative lg:inset-auto lg:z-auto lg:w-1/4 lg:bg-transparent lg:shadow-none lg:p-0 lg:block
                ${isMobileFiltersOpen ? 'block' : 'hidden'}
              `}
            >
              <div className="flex justify-between items-center mb-6 lg:hidden">
                <h3 className="text-xl font-bold font-display text-brand-secondary">{isRtl ? 'تصفية' : 'Filters'}</h3>
                <button onClick={() => setIsMobileFiltersOpen(false)} className="text-stone-400 hover:text-brand-secondary">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-8 bg-white lg:p-6 lg:rounded-2xl lg:border lg:border-stone-200">
                
                {/* Search */}
                <div>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder={isRtl ? "البحث عن المنتجات..." : "Search products, SKU..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full bg-stone-50 border border-stone-200 rounded-lg py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                    />
                    <Search size={18} className={`absolute top-1/2 -translate-y-1/2 text-stone-400 ${isRtl ? 'right-3' : 'left-3'}`} />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery("")} className={`absolute top-1/2 -translate-y-1/2 text-stone-400 hover:text-brand-secondary ${isRtl ? 'left-3' : 'right-3'}`}>
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Filter Sections */}
                <FilterSection isRtl={isRtl} title="Categories" titleAr="الفئات" options={filterOptions.categories} selected={selectedCategories} toggle={(val) => toggleFilter(selectedCategories, setSelectedCategories, val)} />
                <FilterSection isRtl={isRtl} title="Brands" titleAr="العلامات التجارية" options={filterOptions.brands} selected={selectedBrands} toggle={(val) => toggleFilter(selectedBrands, setSelectedBrands, val)} />
                
                <FilterSection isRtl={isRtl} title="Collections" titleAr="المجموعات" options={filterOptions.collections.map(c => ({id: c, name: c}))} selected={selectedCollections} toggle={(val) => toggleFilter(selectedCollections, setSelectedCollections, val)} />
                <FilterSection isRtl={isRtl} title="Materials" titleAr="المواد" options={filterOptions.materials.map(c => ({id: c, name: c}))} selected={selectedMaterials} toggle={(val) => toggleFilter(selectedMaterials, setSelectedMaterials, val)} />
                <FilterSection isRtl={isRtl} title="Finishes" titleAr="التشطيبات" options={filterOptions.finishes.map(c => ({id: c, name: c}))} selected={selectedFinishes} toggle={(val) => toggleFilter(selectedFinishes, setSelectedFinishes, val)} />
                
                {activeFilterCount > 0 && (
                  <button 
                    onClick={clearAllFilters}
                    className="w-full py-3 bg-stone-100 text-stone-600 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-stone-200 transition-colors"
                  >
                    {isRtl ? 'مسح جميع الفلاتر' : 'Clear All Filters'}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {isMobileFiltersOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileFiltersOpen(false)} />
        )}

        {/* Main Content */}
        <div className="w-full lg:w-3/4">
          
          {/* Active Filters & Controls */}
          <div className="mb-6 bg-white p-4 rounded-xl border border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-brand-secondary">
                {totalCount} <span className="text-stone-400 font-normal">{isRtl ? 'المنتجات الموجودة' : 'Products Found'}</span>
              </h2>
            </div>
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className={`hidden lg:flex items-center gap-2 border-stone-200 ${isRtl ? 'border-l pl-4' : 'border-r pr-4'}`}>
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-stone-100 text-brand-primary' : 'text-stone-400 hover:text-stone-600'}`}>
                  <LayoutGrid size={18} />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-stone-100 text-brand-primary' : 'text-stone-400 hover:text-stone-600'}`}>
                  <List size={18} />
                </button>
              </div>
              
              <div className="flex items-center gap-2 flex-grow sm:flex-grow-0">
                <span className="text-sm font-semibold text-stone-500 whitespace-nowrap">{isRtl ? 'ترتيب حسب:' : 'Sort By:'}</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-brand-primary w-full sm:w-auto ${isRtl ? 'pr-8' : ''}`}
                  dir={isRtl ? 'rtl' : 'ltr'}
                >
                  <option value="Recommended">{isRtl ? 'موصى به' : 'Recommended'}</option>
                  <option value="Newest">{isRtl ? 'الأحدث' : 'Newest'}</option>
                  <option value="A-Z">{isRtl ? 'الاسم أ-ي' : 'Name A-Z'}</option>
                  <option value="Z-A">{isRtl ? 'الاسم ي-أ' : 'Name Z-A'}</option>
                  <option value="Brand">{isRtl ? 'الماركة' : 'Brand'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedCategories.map(c => {
                const opt = filterOptions.categories.find(opt => opt.id === c);
                return (
                  <span key={c} className="inline-flex items-center gap-1 bg-white border border-stone-200 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm text-stone-700">
                    {opt ? (isRtl && opt.nameAr ? opt.nameAr : opt.name) : c}
                    <button onClick={() => toggleFilter(selectedCategories, setSelectedCategories, c)} className="hover:text-red-500"><X size={12}/></button>
                  </span>
                )
              })}
              {selectedBrands.map(b => {
                const opt = filterOptions.brands.find(opt => opt.id === b);
                return (
                  <span key={b} className="inline-flex items-center gap-1 bg-white border border-stone-200 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm text-stone-700">
                    {opt ? (isRtl && opt.nameAr ? opt.nameAr : opt.name) : b}
                    <button onClick={() => toggleFilter(selectedBrands, setSelectedBrands, b)} className="hover:text-red-500"><X size={12}/></button>
                  </span>
                )
              })}
              {selectedCollections.map(c => (
                 <span key={c} className="inline-flex items-center gap-1 bg-white border border-stone-200 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm text-stone-700">
                 {c}
                 <button onClick={() => toggleFilter(selectedCollections, setSelectedCollections, c)} className="hover:text-red-500"><X size={12}/></button>
               </span>
              ))}
            </div>
          )}

          {/* Product Grid/List */}
          {loading ? (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-stone-200 overflow-hidden animate-pulse">
                  <div className="aspect-square bg-stone-100"></div>
                  <div className="p-6">
                    <div className="h-4 bg-stone-100 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-stone-100 rounded w-1/2 mb-6"></div>
                    <div className="h-8 bg-stone-100 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-16 text-center shadow-sm">
              <Search size={48} className="mx-auto text-stone-200 mb-6" />
              <h3 className="text-2xl font-bold font-display text-brand-secondary mb-2">{isRtl ? 'لم يتم العثور على منتجات' : 'No products found'}</h3>
              <p className="text-stone-500 max-w-md mx-auto mb-8">{isRtl ? 'حاول تعديل معايير البحث أو التصفية.' : 'Try adjusting your filters or search criteria.'}</p>
              <button onClick={clearAllFilters} className="inline-flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-brand-secondary transition-colors">
                {isRtl ? 'مسح جميع الفلاتر' : 'Clear All Filters'}
              </button>
            </div>
          ) : (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {products.map(product => {
                const brand = getBrand(product.brandId, product.brand);
                const category = getCategory(product.categoryId, product.category);
                const productUrl = `/products/${brand?.slug || 'brand'}/${category?.slug || 'category'}/${product.slug || product.sku}`;
                
                const productName = isRtl && product.nameAr ? product.nameAr : product.name;
                const brandName = brand ? (isRtl && brand.nameAr ? brand.nameAr : brand.name) : product.brand;
                const catName = category ? (isRtl && category.nameAr ? category.nameAr : category.name) : product.category;
                
                if (viewMode === 'list') {
                  return (
                    <div key={product.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row group">
                      <Link to={productUrl} className="w-full sm:w-1/3 aspect-square sm:aspect-auto bg-stone-50 p-6 flex items-center justify-center relative border-b sm:border-b-0 sm:border-r border-stone-200 shrink-0">
                        <OptimizedImage 
                          src={product.thumbnail || product.images?.[0] || 'https://placehold.co/400'} 
                          alt={product.name}
                          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className={`absolute top-4 ${isRtl ? 'right-4' : 'left-4'} flex flex-col gap-1`}>
                          <span className="bg-white/90 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-brand-secondary px-2 py-1 rounded shadow-sm">
                            {brandName}
                          </span>
                        </div>
                      </Link>
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <Link to={productUrl} className="font-bold text-xl text-brand-secondary hover:text-brand-primary transition-colors">
                              {productName}
                            </Link>
                            <p className="font-mono text-sm text-stone-400 mt-1">{product.sku}</p>
                          </div>
                        </div>
                        <p className="text-sm text-stone-600 line-clamp-2 mb-4">
                          {isRtl && product.descriptionAr ? product.descriptionAr : (product.shortDescription || product.description)}
                        </p>
                        
                        {product.material && (
                          <p className="text-xs text-stone-500 mb-4"><strong>{isRtl ? 'المادة:' : 'Material:'}</strong> {product.material}</p>
                        )}
                        
                        <div className="mt-auto pt-4 border-t border-stone-100 flex items-center justify-between gap-4">
                          <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-stone-500 hover:text-brand-primary">
                            <input type="checkbox" className="rounded border-stone-300 text-brand-primary focus:ring-brand-primary" />
                            {isRtl ? 'مقارنة' : 'Compare'}
                          </label>
                          <div className="flex gap-2">
                            <Link to={`/contact?tab=quote&sku=${product.sku}`} className="p-2 border border-stone-200 rounded text-stone-600 hover:bg-stone-50 hover:text-brand-primary" title={isRtl ? 'طلب تسعير' : 'Add to Inquiry'}>
                              <FileText size={18} />
                            </Link>
                            <Link to={productUrl} className="px-4 py-2 bg-brand-primary text-white rounded text-sm font-bold uppercase tracking-wider hover:bg-brand-secondary transition-colors">
                              {isRtl ? 'التفاصيل' : 'View Details'}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Grid View
                return (
                  <div key={product.id} className="group bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
                    <Link to={productUrl} className="aspect-square relative overflow-hidden bg-stone-50 p-6 flex items-center justify-center">
                      <OptimizedImage 
                        src={product.thumbnail || product.images?.[0] || 'https://placehold.co/400'} 
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className={`absolute top-4 ${isRtl ? 'right-4' : 'left-4'}`}>
                        <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-brand-secondary px-2 py-1 rounded shadow-sm">
                          {brandName}
                        </span>
                      </div>
                    </Link>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="font-bold text-lg text-brand-secondary mb-1 group-hover:text-brand-primary transition-colors line-clamp-2">
                        {productName}
                      </h3>
                      <p className="font-mono text-xs text-stone-400 mb-4">{product.sku}</p>
                      
                      <div className="mt-auto pt-4 border-t border-stone-100 flex items-center justify-between">
                        <Link to={`/contact?tab=quote&sku=${product.sku}`} className="text-xs font-bold text-stone-500 uppercase flex items-center gap-1 hover:text-brand-primary">
                          <FileText size={14} /> {isRtl ? 'تسعير' : 'Inquiry'}
                        </Link>
                        <Link to={productUrl} className="text-xs font-bold text-brand-primary uppercase flex items-center gap-1 group-hover:gap-2 transition-all">
                          {isRtl ? 'التفاصيل' : 'Details'} <ArrowRight size={14} className={isRtl ? 'rotate-180' : ''} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {hasMore && (
            <div className="mt-12 text-center">
              <button 
                onClick={() => fetchProducts(true)}
                disabled={loadingMore}
                className="bg-white border border-stone-200 text-stone-600 px-8 py-3 rounded-xl font-bold uppercase tracking-wider hover:bg-stone-50 hover:text-brand-primary transition-colors disabled:opacity-50"
              >
                {loadingMore ? (isRtl ? 'جاري التحميل...' : 'Loading...') : (isRtl ? 'عرض المزيد من المنتجات' : 'Load More Products')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
