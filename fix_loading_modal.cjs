const fs = require('fs');
let content = fs.readFileSync('src/pages/ProductDetail.tsx', 'utf8');

content = content.replace(
  /<InquiryModal[\s\S]*?product=\{\{[\s\S]*?\}\}\s*\/>/,
  ''
);

fs.writeFileSync('src/pages/ProductDetail.tsx', content);
