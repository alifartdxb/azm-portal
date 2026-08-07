const fs = require('fs');
let content = fs.readFileSync('src/pages/ProductDetail.tsx', 'utf8');

const modalHtml = `
      <InquiryModal 
        isOpen={isInquiryModalOpen} 
        onClose={() => setIsInquiryModalOpen(false)} 
        product={{
          name: product.name,
          sku: product.sku,
          brand: brand?.name || product.brand || '',
          category: category?.name || product.category || ''
        }}
      />
    </div>
  );
}`;

content = content.replace(
  /\s*<\/div>\s*\);\s*\}\s*$/,
  modalHtml
);

fs.writeFileSync('src/pages/ProductDetail.tsx', content);
