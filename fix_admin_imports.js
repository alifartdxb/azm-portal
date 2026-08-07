import fs from 'fs';
let content = fs.readFileSync('src/pages/admin/AdminLayout.tsx', 'utf8');

content = content.replace('  Upload\n  Layers,', '  Upload,\n  Layers,');
fs.writeFileSync('src/pages/admin/AdminLayout.tsx', content);
