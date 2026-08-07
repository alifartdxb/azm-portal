const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/AdminSystem.tsx', 'utf8');

const newRepairProducts = `  const repairProducts = async () => {
    if (!window.confirm("Are you sure you want to run the product repair utility? This will update products missing slugs or required fields.")) {
      return;
    }
    
    setIsRepairing(true);
    setLogs([]);
    addLog("Starting product repair process...");
    
    try {
      const products = await getCollection('products') as any[];
      addLog(\`Found \${products.length} products to check.\`);
      
      let fixedCount = 0;
      
      const existingSlugs = new Set();
      // First pass: collect all valid existing slugs
      for (const p of products) {
        if (p.urlSlug) existingSlugs.add(p.urlSlug);
        else if (p.slug) existingSlugs.add(p.slug);
      }
      
      const generateUniqueSlug = (baseSlug) => {
        let slug = baseSlug;
        let counter = 1;
        while (existingSlugs.has(slug)) {
          slug = \`\${baseSlug}-\${counter}\`;
          counter++;
        }
        existingSlugs.add(slug);
        return slug;
      };
      
      for (const product of products) {
        let needsUpdate = false;
        const updates: any = {};
        
        let targetSlug = product.urlSlug || product.slug;
        if (!targetSlug && product.name) {
           let baseSlug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
           if (product.sku) {
             baseSlug += '-' + product.sku.toLowerCase().replace(/[^a-z0-9]+/g, '-');
           }
           baseSlug = baseSlug.replace(/^-+|-+$/g, ''); // Trim dashes
           if (!baseSlug) baseSlug = 'product-' + Math.random().toString(36).substring(7);
           
           targetSlug = generateUniqueSlug(baseSlug);
           updates.urlSlug = targetSlug;
           needsUpdate = true;
           addLog(\`Generated unique urlSlug for \${product.name} -> \${targetSlug}\`);
        }

        // Fix missing slug
        if (!product.slug && targetSlug) {
          updates.slug = targetSlug;
          needsUpdate = true;
          addLog(\`Fixed missing slug for \${product.name} -> \${targetSlug}\`);
        }
        
        // Fix missing urlSlug if it has slug but no urlSlug
        if (!product.urlSlug && targetSlug) {
          updates.urlSlug = targetSlug;
          needsUpdate = true;
          addLog(\`Fixed missing urlSlug for \${product.name} -> \${targetSlug}\`);
        }
        
        // Ensure seo properties exist
        if (!product.seoTitle) {
          updates.seoTitle = product.name || 'Premium Product';
          needsUpdate = true;
          addLog(\`Generated SEO title for \${product.name || 'Product'}\`);
        }
        
        if (!product.metaDescription) {
          let shortDesc = product.shortDescription;
          if (!shortDesc && product.description) {
            shortDesc = product.description.replace(/<[^>]*>?/gm, '').substring(0, 150);
          }
          updates.metaDescription = shortDesc || (product.name ? \`Buy \${product.name} from AZM Group.\` : 'Explore our premium products.');
          needsUpdate = true;
          addLog(\`Generated meta description for \${product.name || 'Product'}\`);
        }

        if (needsUpdate) {
          await updateDocument('products', product.id, updates);
          fixedCount++;
        }
      }
      
      addLog(\`Repair complete. Fixed \${fixedCount} products.\`);
    } catch (error) {
      addLog(\`ERROR: \${error instanceof Error ? error.message : String(error)}\`);
    } finally {
      setIsRepairing(false);
    }
  };`;

// Replace the old repairProducts method
const startIndex = code.indexOf('const repairProducts = async () => {');
const endIndex = code.indexOf('  return (', startIndex);
if (startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex) + newRepairProducts + '\n' + code.substring(endIndex);
  fs.writeFileSync('src/pages/admin/AdminSystem.tsx', code);
  console.log("Successfully patched AdminSystem.tsx");
} else {
  console.error("Could not find repairProducts function");
}
