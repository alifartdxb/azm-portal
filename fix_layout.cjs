const fs = require('fs');
let content = fs.readFileSync('src/components/Layout.tsx', 'utf8');

// Fix Mobile Menu Button
content = content.replace(
  /<a href="mailto:sales@alzahrabm\.com"([\s\S]*?)onClick=\{\(\) => setIsMobileMenuOpen\(\!isMobileMenuOpen\)\}([\s\S]*?)aria-label/g,
  '<button$1onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}$2aria-label'
);

content = content.replace(
  /\{isMobileMenuOpen \? <X size=\{24\} \/> : <Menu size=\{24\} \/>\}\s*<\/a>/,
  '{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}\n              </button>'
);

// Fix other broken floating buttons (WhatsApp)
content = content.replace(
  /<a href="mailto:sales@alzahrabm.com"([\s\S]*?)title="WhatsApp Order"[\s\S]*?<\/a>/,
  '<a href="https://wa.me/971558090292" target="_blank" rel="noopener noreferrer"$1title="WhatsApp Order">\n          <MessageCircle size={28} />\n          <span className="absolute right-full mr-4 bg-stone-900 text-white px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">\n            WhatsApp Order\n          </span>\n        </a>'
);

// Make sure Email floating button is right
content = content.replace(
  /<a href="mailto:sales@alzahrabm.com"([\s\S]*?)title="Product Inquiry"[\s\S]*?<\/a>/,
  '<a href="mailto:sales@alzahrabm.com"$1title="Email Inquiry">\n          <Mail size={24} />\n          <span className="absolute right-full mr-4 bg-stone-900 text-white px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">\n            Email Inquiry\n          </span>\n        </a>'
);

fs.writeFileSync('src/components/Layout.tsx', content);
