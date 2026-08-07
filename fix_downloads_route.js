import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace routes
content = content.replace(
  '<Route path="downloads" element={<Catalogues />} />',
  '<Route path="downloads" element={<Catalogues />} />' // no-op fallback
);

fs.writeFileSync('src/App.tsx', content);
