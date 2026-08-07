import fs from 'fs';
let content = fs.readFileSync('src/pages/admin/AdminTestimonials.tsx', 'utf8');
console.log(content.includes('projectRef'));
