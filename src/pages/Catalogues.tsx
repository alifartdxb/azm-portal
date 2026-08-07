import React, { useState, useEffect, useMemo } from 'react';
import { SEO } from '../components/SEO';
import { OptimizedImage } from '../components/OptimizedImage';
import { getCollection } from '../services/db';
import { Search, Filter, Download, Eye, FileText, ChevronRight, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

// Fallback mock data
const MOCK_CATALOGUES = [
  {
    id: 'c1',
    title: 'VADO Life Collection Catalogue',
    slug: 'vado-life-collection',
    brand: 'VADO',
    category: 'Mixers',
    productType: 'Bathroom',
    thumbnail: 'https://placehold.co/600x800?text=VADO+Catalogue',
    pdfUrl: '#',
    description: 'Explore the full range of VADO Life collection featuring stunning brassware for modern bathrooms.',
    year: '2025',
    language: 'English',
    pages: 142,
    fileSize: '15 MB'
  },
  {
    id: 'c2',
    title: 'Premium Italian Marble Collection',
    slug: 'premium-italian-marble',
    brand: 'AZM',
    category: 'Marble',
    productType: 'Natural Stone',
    thumbnail: 'https://placehold.co/600x800?text=Marble+Catalogue',
    pdfUrl: '#',
    description: 'Discover our hand-picked selection of Italian marble for luxury interiors.',
    year: '2024',
    language: 'English',
    pages: 64,
    fileSize: '24 MB'
  },
  {
    id: 'c3',
    title: 'Porcelain Tiles Guide',
    slug: 'porcelain-tiles-guide',
    brand: 'AZM',
    category: 'Tiles',
    productType: 'Porcelain',
    thumbnail: 'https://placehold.co/600x800?text=Tiles+Catalogue',
    pdfUrl: '#',
    description: 'Comprehensive guide to large format porcelain tiles.',
    year: '2025',
    language: 'English, Arabic',
    pages: 96,
    fileSize: '18 MB'
  }
];


function FilterSection({ title, options, selected, toggle }: { title: string, options: string[], selected: string[], toggle: (val: string) => void }) {
  const [isOpen, setIsOpen] = React.useState(true);
  if (options.length === 0) return null;
  return (
    <div className="border-b border-stone-100 pb-6 mb-6 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left font-bold text-sm uppercase tracking-widest text-stone-900 mb-4"
      >
        {title}
        <ChevronRight size={16} className={`transform transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {options.map((opt) => (
                <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selected.includes(opt) ? 'bg-brand-primary border-brand-primary text-white' : 'border-stone-300 group-hover:border-brand-primary'}`}>
                    {selected.includes(opt) && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                  </div>
                  <span className={`text-sm ${selected.includes(opt) ? 'font-bold text-stone-900' : 'text-stone-600 group-hover:text-stone-900 transition-colors'}`}>{opt}</span>
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export function Catalogues() {
  const [catalogues, setCatalogues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [previewPdf, setPreviewPdf] = useState<string | null>(null);

  // Filters
  
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>([]);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);
  const [selectedTileTypes, setSelectedTileTypes] = useState<string[]>([]);
  const [selectedStoneTypes, setSelectedStoneTypes] = useState<string[]>([]);
  const [selectedThicknesses, setSelectedThicknesses] = useState<string[]>([]);


  useEffect(() => {
    async function loadCatalogues() {
      try {
        setLoading(true);
        const data = await getCollection('catalogues');
        if (data && data.length > 0) {
          setCatalogues(data);
        } else {
          setCatalogues(MOCK_CATALOGUES);
        }
      } catch (e) {
        console.error("Failed to load catalogues", e);
        setCatalogues(MOCK_CATALOGUES);
      } finally {
        setLoading(false);
      }
    }
    loadCatalogues();
  }, []);

  // Extract unique filter options
  const allBrands = Array.from<string>(new Set(catalogues.map(c => c.brand).filter(Boolean)));
  const allCategories = Array.from<string>(new Set(catalogues.map(c => c.category).filter(Boolean)));
  const allYears = Array.from<string>(new Set(catalogues.map(c => c.year).filter(Boolean))).sort().reverse();
  const allProductTypes = Array.from<string>(new Set(catalogues.map(c => c.productType).filter(Boolean)));
  const allCollections = Array.from<string>(new Set(catalogues.map(c => c.collection).filter(Boolean)));
  const allSizes = Array.from<string>(new Set(catalogues.map(c => c.size).filter(Boolean)));
  const allFinishes = Array.from<string>(new Set(catalogues.map(c => c.finish).filter(Boolean)));
  const allOrigins = Array.from<string>(new Set(catalogues.map(c => c.origin || c.madeIn).filter(Boolean)));
  const allTileTypes = Array.from<string>(new Set(catalogues.map(c => c.tileType).filter(Boolean)));
  const allStoneTypes = Array.from<string>(new Set(catalogues.map(c => c.stoneType).filter(Boolean)));
  const allThicknesses = Array.from<string>(new Set(catalogues.map(c => c.thickness).filter(Boolean)));

  const toggleFilter = (list: string[], setList: (l: string[]) => void, value: string) => {
    if (list.includes(value)) {
      setList(list.filter(item => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  
  const filteredCatalogues = useMemo(() => {
    return catalogues.filter(c => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = searchQuery === '' || 
        (c.title && c.title.toLowerCase().includes(q)) || 
        (c.brand && c.brand.toLowerCase().includes(q)) ||
        (c.category && c.category.toLowerCase().includes(q)) ||
        (c.productType && c.productType.toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        (c.year && c.year.toLowerCase().includes(q)) ||
        (c.tags && c.tags.some((t: string) => t.toLowerCase().includes(q)));
        
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(c.brand);
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(c.category);
      const matchesProductType = selectedProductTypes.length === 0 || selectedProductTypes.includes(c.productType);
      const matchesYear = selectedYears.length === 0 || selectedYears.includes(c.year);
      const matchesLanguage = selectedLanguages.length === 0 || selectedLanguages.includes(c.language);
      const matchesCollection = selectedCollections.length === 0 || selectedCollections.includes(c.collection);
      const matchesSize = selectedSizes.length === 0 || selectedSizes.includes(c.size);
      const matchesFinish = selectedFinishes.length === 0 || selectedFinishes.includes(c.finish);
      const matchesOrigin = selectedOrigins.length === 0 || selectedOrigins.includes(c.origin) || selectedOrigins.includes(c.madeIn);
      const matchesTileType = selectedTileTypes.length === 0 || selectedTileTypes.includes(c.tileType);
      const matchesStoneType = selectedStoneTypes.length === 0 || selectedStoneTypes.includes(c.stoneType);
      const matchesThickness = selectedThicknesses.length === 0 || selectedThicknesses.includes(c.thickness);

      return matchesSearch && matchesBrand && matchesCategory && matchesProductType && matchesYear && matchesLanguage && matchesCollection && matchesSize && matchesFinish && matchesOrigin && matchesTileType && matchesStoneType && matchesThickness;
    });
  }, [catalogues, searchQuery, selectedBrands, selectedCategories, selectedProductTypes, selectedYears, selectedLanguages, selectedCollections, selectedSizes, selectedFinishes, selectedOrigins, selectedTileTypes, selectedStoneTypes, selectedThicknesses]);


  
  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedProductTypes([]);
    setSelectedYears([]);
    setSelectedLanguages([]);
    setSelectedCollections([]);
    setSelectedSizes([]);
    setSelectedFinishes([]);
    setSelectedOrigins([]);
    setSelectedTileTypes([]);
    setSelectedStoneTypes([]);
    setSelectedThicknesses([]);
    setSearchQuery('');
  };


  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Product Catalogues Library",
      "description": "Browse complete product catalogues from leading international brands including bathroom solutions, sanitary ware, tiles, and building materials.",
      "url": window.location.href
    }
  ];

  return (
    <div className="flex-grow flex flex-col bg-stone-50">
      <SEO 
        title="Product Catalogues Library | Al Zahra Al Malakia"
        description="Browse complete product catalogues from leading international brands including bathroom solutions, sanitary ware, tiles, and building materials."
        keywords={["Bathroom Catalogue UAE", "Sanitary Ware Catalogue Dubai", "Tile Catalogue UAE", "Luxury Bathroom Products Catalogue", "Building Material Catalogue Dubai", "VADO Catalogue UAE", "Tile Supplier Dubai Catalogue"]}
        schemas={schemas}
      />

      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <OptimizedImage 
            src="https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=2069&auto=format&fit=crop" 
            alt="Luxury Bathroom Showroom"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6">Explore Our Product Catalogues</h1>
          <p className="text-lg md:text-xl text-stone-200 max-w-3xl mx-auto mb-8 font-light leading-relaxed">
            Browse complete product catalogues from leading international brands including bathroom solutions, sanitary ware, tiles, and building materials.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => {
                const el = document.getElementById('catalogue-library');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-3 bg-brand-primary text-white rounded-full font-bold uppercase tracking-wider text-sm hover:bg-brand-primary/90 transition-colors shadow-lg"
            >
              Browse Catalogues
            </button>
            <Link 
              to="/contact"
              className="px-8 py-3 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full font-bold uppercase tracking-wider text-sm hover:bg-white hover:text-brand-secondary transition-colors"
            >
              Request Assistance
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section id="catalogue-library" className="py-16 md:py-24">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar / Filters */}
            <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-2xl border border-stone-200 p-6 sticky top-24 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-stone-900 font-display text-lg flex items-center gap-2">
                    <Filter size={20} className="text-brand-primary" /> Filters
                  </h3>
                  {(selectedBrands.length > 0 || selectedCategories.length > 0 || selectedYears.length > 0) && (
                    <button onClick={clearFilters} className="text-xs font-bold text-stone-500 hover:text-brand-primary uppercase tracking-wider">
                      Clear All
                    </button>
                  )}
                </div>

                <div className="space-y-8">
                  
                  <FilterSection title="Brands" options={allBrands} selected={selectedBrands} toggle={(val) => toggleFilter(selectedBrands, setSelectedBrands, val)} />
                  <FilterSection title="Categories" options={allCategories} selected={selectedCategories} toggle={(val) => toggleFilter(selectedCategories, setSelectedCategories, val)} />
                  <FilterSection title="Product Types" options={allProductTypes} selected={selectedProductTypes} toggle={(val) => toggleFilter(selectedProductTypes, setSelectedProductTypes, val)} />
                  <FilterSection title="Collections" options={allCollections} selected={selectedCollections} toggle={(val) => toggleFilter(selectedCollections, setSelectedCollections, val)} />
                  <FilterSection title="Tile Types" options={allTileTypes} selected={selectedTileTypes} toggle={(val) => toggleFilter(selectedTileTypes, setSelectedTileTypes, val)} />
                  <FilterSection title="Stone Types" options={allStoneTypes} selected={selectedStoneTypes} toggle={(val) => toggleFilter(selectedStoneTypes, setSelectedStoneTypes, val)} />
                  <FilterSection title="Sizes" options={allSizes} selected={selectedSizes} toggle={(val) => toggleFilter(selectedSizes, setSelectedSizes, val)} />
                  <FilterSection title="Finishes" options={allFinishes} selected={selectedFinishes} toggle={(val) => toggleFilter(selectedFinishes, setSelectedFinishes, val)} />
                  <FilterSection title="Thickness" options={allThicknesses} selected={selectedThicknesses} toggle={(val) => toggleFilter(selectedThicknesses, setSelectedThicknesses, val)} />
                  <FilterSection title="Origin / Made In" options={allOrigins} selected={selectedOrigins} toggle={(val) => toggleFilter(selectedOrigins, setSelectedOrigins, val)} />
                  <FilterSection title="Years" options={allYears} selected={selectedYears} toggle={(val) => toggleFilter(selectedYears, setSelectedYears, val)} />
                </div>
              </div>
            </div>
 {/* Catalogues Grid */}
            <div className="lg:w-3/4 flex flex-col">
              
              {/* Search & Actions Bar */}
              <div className="bg-white rounded-2xl border border-stone-200 p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
                <div className="relative w-full md:w-96">
                  <Search className="absolute top-1/2 left-4 transform -translate-y-1/2 text-stone-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="Search by title, brand, category..." 
                    className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute top-1/2 right-4 transform -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  <p className="text-sm text-stone-500 font-medium">
                    Showing <span className="text-brand-secondary font-bold">{filteredCatalogues.length}</span> catalogues
                  </p>
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden px-4 py-2 border border-stone-200 rounded-xl text-sm font-bold text-stone-700 flex items-center gap-2 hover:bg-stone-50"
                  >
                    <Filter size={16} /> Filters
                  </button>
                </div>
              </div>

              {/* Grid */}
              {loading ? (
                <div className="flex-grow flex items-center justify-center min-h-[300px]">
                  <div className="w-8 h-8 border-4 border-stone-200 border-t-brand-primary rounded-full animate-spin"></div>
                </div>
              ) : filteredCatalogues.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center flex-grow flex flex-col items-center justify-center">
                  <FileText size={48} className="text-stone-300 mb-4" />
                  <h3 className="text-xl font-bold text-stone-800 mb-2">No Catalogues Found</h3>
                  <p className="text-stone-500 max-w-md mx-auto mb-6">We couldn't find any catalogues matching your current filters. Try adjusting your search criteria.</p>
                  <button 
                    onClick={clearFilters}
                    className="px-6 py-2 bg-stone-100 text-stone-700 rounded-lg font-bold hover:bg-stone-200 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCatalogues.map(catalogue => (
                    <div key={catalogue.id} className="group bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                      <div className="aspect-[3/4] relative overflow-hidden bg-stone-100 flex items-center justify-center">
                        <OptimizedImage 
                          src={catalogue.thumbnail} 
                          alt={catalogue.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <button 
                            onClick={() => setPreviewPdf(catalogue.pdfUrl)}
                            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-lg mr-3"
                            title="Preview PDF"
                          >
                            <Eye size={20} />
                          </button>
                          <a 
                            href={catalogue.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 bg-brand-primary text-white rounded-full flex items-center justify-center hover:bg-brand-secondary transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75 shadow-lg"
                            title="Download PDF"
                          >
                            <Download size={20} />
                          </a>
                        </div>
                        <div className="absolute top-4 left-4">
                          <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-brand-secondary px-2 py-1 rounded shadow-sm">
                            {catalogue.brand}
                          </span>
                        </div>
                        {catalogue.year && (
                          <div className="absolute top-4 right-4">
                            <span className="bg-brand-primary text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm">
                              {catalogue.year}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                          {catalogue.category} {catalogue.productType && <span className="mx-1">•</span>} {catalogue.productType}
                        </div>
                        <h3 className="text-lg font-bold font-display text-brand-secondary mb-3 leading-snug line-clamp-2 group-hover:text-brand-primary transition-colors">
                          {catalogue.title}
                        </h3>
                        
                        <div className="mt-auto pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                          <div className="flex items-center gap-1">
                            <FileText size={14} /> {catalogue.pages || '?'} Pages
                          </div>
                          <div>
                            {catalogue.fileSize || 'PDF'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PDF Preview Modal */}
      <AnimatePresence>
        {previewPdf && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col bg-stone-900/95 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/50">
              <h3 className="text-white font-bold tracking-wide">Document Preview</h3>
              <div className="flex items-center gap-4">
                <a 
                  href={previewPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-brand-primary/90 transition-colors"
                >
                  <Download size={16} /> Download PDF
                </a>
                <button 
                  onClick={() => setPreviewPdf(null)}
                  className="p-2 text-stone-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="flex-grow w-full h-full p-4 md:p-8 flex items-center justify-center">
              {/* Note: In a real app, use an iframe or pdf.js. Using a placeholder for preview since we don't have actual PDFs to render */}
              {previewPdf !== '#' ? (
                <iframe src={`${previewPdf}#toolbar=0`} className="w-full max-w-5xl h-full bg-white rounded-xl shadow-2xl" title="PDF Preview" />
              ) : (
                <div className="w-full max-w-5xl h-full bg-stone-100 rounded-xl shadow-2xl flex flex-col items-center justify-center text-center p-8">
                  <FileText size={64} className="text-stone-300 mb-4" />
                  <h4 className="text-2xl font-bold text-stone-800 mb-2">Preview Not Available</h4>
                  <p className="text-stone-500 mb-6 max-w-md">This is a mock catalogue entry. In the live system, the uploaded PDF will be displayed here securely.</p>
                  <button 
                    onClick={() => setPreviewPdf(null)}
                    className="px-6 py-2 border border-stone-300 text-stone-600 rounded-lg hover:bg-stone-200 font-bold transition-colors"
                  >
                    Close Preview
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Featured / Related Products CTA */}
      <section className="py-20 bg-brand-secondary text-white">
        <div className="w-full max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">Need expert assistance?</h2>
          <p className="text-stone-300 max-w-2xl mx-auto mb-10 text-lg">
            Our project consultants are ready to help you navigate our vast collections and find the perfect products for your specific requirements.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact" className="px-8 py-4 bg-brand-primary text-white rounded-full font-bold uppercase tracking-wider text-sm hover:bg-brand-primary/90 transition-colors shadow-lg">
              Contact Sales Team
            </Link>
            <a href="https://wa.me/971558090292" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-[#25D366] text-white rounded-full font-bold uppercase tracking-wider text-sm hover:bg-[#20bd5a] transition-colors shadow-lg flex items-center justify-center gap-2">
              WhatsApp Inquiry
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
