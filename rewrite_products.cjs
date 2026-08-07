const fs = require('fs');
let content = fs.readFileSync('src/pages/Products.tsx', 'utf8');

// 1. Add all the new state variables
content = content.replace(
  /const \[selectedFinishes, setSelectedFinishes\] = useState<string\[\]>\(\[\]\);/,
  `const [selectedFinishes, setSelectedFinishes] = useState<string[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("Newest");`
);

// 2. Clear filters function
content = content.replace(
  /const clearAllFilters = \(\) => \{[\s\S]*?\};/,
  `const clearAllFilters = () => {
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
  };`
);

// 3. Extractor helpers
const filterHelpers = `
  // Helper to extract unique non-empty values
  const getUniqueValues = (key: string) => {
    return Array.from(new Set(products.map(p => p[key]).filter(Boolean))).sort();
  };
  
  const allFinishes = getUniqueValues('finish');
  const allCollections = getUniqueValues('collection');
  const allSeries = getUniqueValues('series');
  const allColors = getUniqueValues('color');
  const allMaterials = getUniqueValues('material');
  const allCountries = getUniqueValues('country');
  const allAvailability = getUniqueValues('availability');
`;

content = content.replace(
  /const allFinishes = Array\.from\(new Set\(products\.map\(p => p\.finish\)\.filter\(Boolean\)\)\)\.sort\(\);/,
  filterHelpers
);

// 4. Update the filteredProducts useMemo block
const newFilterLogic = `
  const filteredProducts = useMemo(() => {
    let result = products;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) || 
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.series && p.series.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.collection && p.collection.toLowerCase().includes(q)) ||
        (p.finish && p.finish.toLowerCase().includes(q)) ||
        (p.color && p.color.toLowerCase().includes(q))
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.categoryId) || selectedCategories.includes(p.category));
    }
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brandId) || selectedBrands.includes(p.brand));
    }
    if (selectedFinishes.length > 0) {
      result = result.filter(p => selectedFinishes.includes(p.finish));
    }
    if (selectedCollections.length > 0) {
      result = result.filter(p => selectedCollections.includes(p.collection));
    }
    if (selectedSeries.length > 0) {
      result = result.filter(p => selectedSeries.includes(p.series));
    }
    if (selectedColors.length > 0) {
      result = result.filter(p => selectedColors.includes(p.color));
    }
    if (selectedMaterials.length > 0) {
      result = result.filter(p => selectedMaterials.includes(p.material));
    }
    if (selectedAvailability.length > 0) {
      result = result.filter(p => selectedAvailability.includes(p.availability));
    }
    if (selectedCountries.length > 0) {
      result = result.filter(p => selectedCountries.includes(p.country));
    }

    // Sort
    switch(sortBy) {
      case "A-Z":
        result = [...result].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "Z-A":
        result = [...result].sort((a, b) => (b.name || "").localeCompare(a.name || ""));
        break;
      case "Brand":
        result = [...result].sort((a, b) => (a.brand || "").localeCompare(b.brand || ""));
        break;
      case "Featured":
        result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      case "Most Viewed":
        result = [...result].sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case "Newest":
      default:
        result = [...result].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
    }

    return result;
  }, [products, searchQuery, selectedCategories, selectedBrands, selectedFinishes, selectedCollections, selectedSeries, selectedColors, selectedMaterials, selectedAvailability, selectedCountries, sortBy]);
`;

content = content.replace(
  /const filteredProducts = useMemo\(\(\) => \{[\s\S]*?\}, \[products, searchQuery, selectedCategories, selectedBrands, selectedFinishes\]\);/,
  newFilterLogic
);

// 5. Update header of product grid
content = content.replace(
  /<span className="ml-3 text-sm font-normal text-stone-400 bg-stone-100 px-3 py-1 rounded-full">\{filteredProducts\.length\} Items<\/span>/,
  '<span className="ml-3 text-sm font-normal text-stone-400 bg-stone-100 px-3 py-1 rounded-full">Showing {filteredProducts.length} of {products.length} Products</span>'
);

content = content.replace(
  /<div className="hidden lg:flex justify-between items-center mb-8 bg-white p-4 rounded-xl border border-stone-200">[\s\S]*?<\/div>/,
  `<div className="hidden lg:flex justify-between items-center mb-8 bg-white p-4 rounded-xl border border-stone-200">
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
          </div>`
);

// 6. Add new filters to the sidebar
const filterSectionsHTML = `
                <FilterSection title="Brands" options={BRANDS_DATA.map(b => ({id: b.id, name: b.name}))} selected={selectedBrands} toggle={(val) => toggleFilter(selectedBrands, setSelectedBrands, val)} />
                <FilterSection title="Categories" options={CATEGORIES_DATA.map(c => ({id: c.id, name: c.name}))} selected={selectedCategories} toggle={(val) => toggleFilter(selectedCategories, setSelectedCategories, val)} />
                <FilterSection title="Collections" options={allCollections.map(f => ({id: f, name: f}))} selected={selectedCollections} toggle={(val) => toggleFilter(selectedCollections, setSelectedCollections, val)} />
                <FilterSection title="Series" options={allSeries.map(f => ({id: f, name: f}))} selected={selectedSeries} toggle={(val) => toggleFilter(selectedSeries, setSelectedSeries, val)} />
                <FilterSection title="Finishes" options={allFinishes.map(f => ({id: f, name: f}))} selected={selectedFinishes} toggle={(val) => toggleFilter(selectedFinishes, setSelectedFinishes, val)} />
                <FilterSection title="Colors" options={allColors.map(f => ({id: f, name: f}))} selected={selectedColors} toggle={(val) => toggleFilter(selectedColors, setSelectedColors, val)} />
                <FilterSection title="Materials" options={allMaterials.map(f => ({id: f, name: f}))} selected={selectedMaterials} toggle={(val) => toggleFilter(selectedMaterials, setSelectedMaterials, val)} />
                <FilterSection title="Availability" options={allAvailability.map(f => ({id: f, name: f}))} selected={selectedAvailability} toggle={(val) => toggleFilter(selectedAvailability, setSelectedAvailability, val)} />
                <FilterSection title="Country of Origin" options={allCountries.map(f => ({id: f, name: f}))} selected={selectedCountries} toggle={(val) => toggleFilter(selectedCountries, setSelectedCountries, val)} />
`;

content = content.replace(
  /<FilterSection title="Brands"[\s\S]*?<FilterSection title="Finishes"[\s\S]*?\/>/,
  filterSectionsHTML
);

fs.writeFileSync('src/pages/Products.tsx', content);
