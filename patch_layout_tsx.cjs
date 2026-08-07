const fs = require('fs');

let content = fs.readFileSync('src/components/Layout.tsx', 'utf8');
content = content.replace(/<li><Link to="\/contact" className="hover:text-white transition-colors">Showroom Locator<\/Link><\/li>/, '<li><Link to="/contact" className="hover:text-white transition-colors">Showroom Locator</Link></li>\n               <li><Link to="/style-guide" className="hover:text-brand-primary text-brand-primary font-semibold transition-colors">UI Style Guide</Link></li>');

fs.writeFileSync('src/components/Layout.tsx', content);
