const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetail.tsx', 'utf8');

const seoComponentUpdate = `      <SEO 
        title={product.seoTitleEn || product.seoTitle || \`\${productName} | \${brandName} | AZM Group\`}
        description={product.metaDescriptionEn || product.seoDescription || product.shortDescription || product.description || \`Buy \${productName} by \${brandName} from AZM Group.\`}
        canonical={product.canonicalUrl || undefined}
        type={product.schemaType === 'Article' ? 'article' : 'product'}
        image={product.ogImage || images[0] || undefined}
        schemas={[schema, breadcrumbSchema]}
        index={product.index !== false}
      />`;

// Use a regex to safely replace the existing SEO block
code = code.replace(/<SEO\s+title=\{[^>]+schemas=\{\[schema, breadcrumbSchema\]\}\s+\/>/, seoComponentUpdate);

fs.writeFileSync('src/pages/ProductDetail.tsx', code);
