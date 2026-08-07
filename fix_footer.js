import fs from 'fs';
let content = fs.readFileSync('src/components/Layout.tsx', 'utf8');

// Replace Quick Links in footer to add the new pages
content = content.replace(
  '<li><Link to="/about" className="hover:text-white transition-colors">Corporate Profile</Link></li>',
  '<li><Link to="/about" className="hover:text-white transition-colors">Corporate Profile</Link></li>\n               <li><Link to="/projects" className="hover:text-white transition-colors">Our Projects</Link></li>\n               <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>\n               <li><Link to="/faqs" className="hover:text-white transition-colors">FAQs</Link></li>'
);

fs.writeFileSync('src/components/Layout.tsx', content);
