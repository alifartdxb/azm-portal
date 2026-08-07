import fs from 'fs';
let content = fs.readFileSync('src/pages/admin/AdminTestimonials.tsx', 'utf8');

content = content.replace(
  "{ key: 'role', label: 'Role/Company', type: 'text' as const, required: true },",
  "{ key: 'position', label: 'Position', type: 'text' as const }, { key: 'company', label: 'Company', type: 'text' as const },"
);
content = content.replace(
  "{ key: 'author', label: 'Author', type: 'text' as const, required: true },",
  "{ key: 'clientName', label: 'Client Name', type: 'text' as const, required: true },"
);
content = content.replace(
  "{ key: 'quote', label: 'Review', type: 'text' as const, required: true },",
  "{ key: 'text', label: 'Testimonial Text', type: 'text' as const, required: true }, { key: 'rating', label: 'Rating (1-5)', type: 'number' as const, required: true }, { key: 'projectRef', label: 'Project Reference', type: 'text' as const },"
);

fs.writeFileSync('src/pages/admin/AdminTestimonials.tsx', content);
