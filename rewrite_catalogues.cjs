const fs = require('fs');
let content = fs.readFileSync('src/pages/Catalogues.tsx', 'utf8');

// 1. Add new filter states
const stateVariables = `
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
`;

content = content.replace(
  /const \[selectedBrands, setSelectedBrands\] = useState<string\[\]>\(\[\]\);\s*const \[selectedCategories, setSelectedCategories\] = useState<string\[\]>\(\[\]\);\s*const \[selectedYears, setSelectedYears\] = useState<string\[\]>\(\[\]\);/,
  stateVariables
);

// 2. Clear filters
const clearFilters = `
  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedProductTypes([]);
    setSelectedYears([]);
    setSelectedLanguages([]);
    setSearchQuery('');
  };
`;

content = content.replace(
  /const clearFilters = \(\) => \{[\s\S]*?\};/,
  clearFilters
);

// 3. Filtered Catalogues logic
const filteredCataloguesLogic = `
  const filteredCatalogues = useMemo(() => {
    return catalogues.filter(c => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = searchQuery === '' || 
        c.title?.toLowerCase().includes(q) || 
        c.brand?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q) ||
        c.productType?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.year?.toLowerCase().includes(q) ||
        (c.tags && c.tags.some((t: string) => t.toLowerCase().includes(q)));
        
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(c.brand);
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(c.category);
      const matchesProductType = selectedProductTypes.length === 0 || selectedProductTypes.includes(c.productType);
      const matchesYear = selectedYears.length === 0 || selectedYears.includes(c.year);
      const matchesLanguage = selectedLanguages.length === 0 || selectedLanguages.includes(c.language);

      return matchesSearch && matchesBrand && matchesCategory && matchesProductType && matchesYear && matchesLanguage;
    });
  }, [catalogues, searchQuery, selectedBrands, selectedCategories, selectedProductTypes, selectedYears, selectedLanguages]);
`;

content = content.replace(
  /const filteredCatalogues = useMemo\(\(\) => \{[\s\S]*?\}, \[catalogues, searchQuery, selectedBrands, selectedCategories, selectedYears\]\);/,
  filteredCataloguesLogic
);

// 4. Update the extraction of unique values
const extractUnique = `
  const brands = Array.from(new Set(catalogues.map(c => c.brand).filter(Boolean)));
  const categories = Array.from(new Set(catalogues.map(c => c.category).filter(Boolean)));
  const productTypes = Array.from(new Set(catalogues.map(c => c.productType).filter(Boolean)));
  const years = Array.from(new Set(catalogues.map(c => c.year).filter(Boolean)));
  const languages = Array.from(new Set(catalogues.map(c => c.language).filter(Boolean)));
`;

content = content.replace(
  /const brands = Array\.from\(new Set\(catalogues\.map\(c => c\.brand\)\.filter\(Boolean\)\)\);\s*const categories = Array\.from\(new Set\(catalogues\.map\(c => c\.category\)\.filter\(Boolean\)\)\);\s*const years = Array\.from\(new Set\(catalogues\.map\(c => c\.year\)\.filter\(Boolean\)\)\);/,
  extractUnique
);

// 5. Add dynamic count to the header
content = content.replace(
  /<h1 className="text-3xl font-bold font-display text-brand-secondary">Technical Catalogues<\/h1>/,
  '<h1 className="text-3xl font-bold font-display text-brand-secondary">Technical Catalogues <span className="text-sm ml-2 bg-brand-primary text-white px-2 py-1 rounded-full">{filteredCatalogues.length}</span></h1>'
);

// 6. Update Filter Sidebar
const filterSidebar = `
                {/* General Filters */}
                <div className="mb-6">
                  <h4 className="font-bold uppercase tracking-wider text-xs text-stone-500 mb-3 pb-2 border-b border-stone-200">General Filters</h4>
                  <FilterGroup title="Brands" options={brands} selected={selectedBrands} toggle={val => toggleFilter(selectedBrands, setSelectedBrands, val)} />
                  <FilterGroup title="Categories" options={categories} selected={selectedCategories} toggle={val => toggleFilter(selectedCategories, setSelectedCategories, val)} />
                  <FilterGroup title="Product Types" options={productTypes} selected={selectedProductTypes} toggle={val => toggleFilter(selectedProductTypes, setSelectedProductTypes, val)} />
                  <FilterGroup title="Years" options={years} selected={selectedYears} toggle={val => toggleFilter(selectedYears, setSelectedYears, val)} />
                  <FilterGroup title="Languages" options={languages} selected={selectedLanguages} toggle={val => toggleFilter(selectedLanguages, setSelectedLanguages, val)} />
                </div>
`;

content = content.replace(
  /<FilterGroup title="Brands" options=\{brands\} selected=\{selectedBrands\} toggle=\{val => toggleFilter\(selectedBrands, setSelectedBrands, val\)\} \/>[\s\S]*?<FilterGroup title="Years" options=\{years\} selected=\{selectedYears\} toggle=\{val => toggleFilter\(selectedYears, setSelectedYears, val\)\} \/>/,
  filterSidebar
);

fs.writeFileSync('src/pages/Catalogues.tsx', content);
