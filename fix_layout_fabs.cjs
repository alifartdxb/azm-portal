const fs = require('fs');
let content = fs.readFileSync('src/components/Layout.tsx', 'utf8');

// Replace Email FAB
content = content.replace(
  /<button\s+className="w-14 h-14 bg-stone-900 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform group relative"\s+title="Product Inquiry"\s*>\s*<Mail size=\{24\} \/>\s*<span className="absolute right-full mr-4 bg-stone-900 text-white px-3 py-1\.5 text-xs font-medium rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">\s*Email Inquiry\s*<\/span>\s*<\/button>/g,
  `<a href="mailto:sales@alzahrabm.com"
          className="w-14 h-14 bg-stone-900 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform group relative"
          title="Email Inquiry"
        >
          <Mail size={24} />
          <span className="absolute right-full mr-4 bg-stone-900 text-white px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Email Inquiry
          </span>
        </a>`
);

// Replace WhatsApp FAB
content = content.replace(
  /<button\s+className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform group relative"\s+title="WhatsApp Order"\s*>\s*<MessageCircle size=\{28\} \/>\s*<span className="absolute right-full mr-4 bg-stone-900 text-white px-3 py-1\.5 text-xs font-medium rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">\s*WhatsApp Order\s*<\/span>\s*<\/button>/g,
  `<a href="https://wa.me/971558090292" target="_blank" rel="noopener noreferrer"
          className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform group relative"
          title="WhatsApp Order"
        >
          <MessageCircle size={28} />
          <span className="absolute right-full mr-4 bg-stone-900 text-white px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            WhatsApp Order
          </span>
        </a>`
);

fs.writeFileSync('src/components/Layout.tsx', content);
