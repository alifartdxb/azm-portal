import fs from 'fs';
let content = fs.readFileSync('src/pages/admin/products/ProductImport.tsx', 'utf8');

content = content.replace(
  "p.forEach(prod => {",
  "p.forEach((prod: any) => {"
);

fs.writeFileSync('src/pages/admin/products/ProductImport.tsx', content);
