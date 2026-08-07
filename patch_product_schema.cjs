const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetail.tsx', 'utf8');

const breadcrumbCode = `
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.azmgroup.ae/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Products",
        "item": "https://www.azmgroup.ae/products"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": brandName || product.brand,
        "item": \`https://www.azmgroup.ae/brands/\${brandSlug}\`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": categoryName || product.category,
        "item": \`https://www.azmgroup.ae/categories/\${categorySlug}\`
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": productName
      }
    ]
  };
`;

code = code.replace("const schema = {", breadcrumbCode + "\n  const schema = {");
code = code.replace("schemas={[schema]}", "schemas={[schema, breadcrumbSchema]}");

fs.writeFileSync('src/pages/ProductDetail.tsx', code);
