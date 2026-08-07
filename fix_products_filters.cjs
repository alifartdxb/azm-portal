const fs = require('fs');
let content = fs.readFileSync('src/pages/Products.tsx', 'utf8');

const filterHelpers = `
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
  const allAvailability = getUniqueValues('availability');
`;

content = content.replace(
  /const allFinishes = Array\.from\(new Set\(products\.flatMap\(p => p\.finish \|\| \[\]\)\)\) as string\[\];/,
  filterHelpers
);

fs.writeFileSync('src/pages/Products.tsx', content);
