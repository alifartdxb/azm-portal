import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

const additionalRoutes = `
                <Route path="collections" element={<AdminGeneric />} />
                <Route path="attributes" element={<AdminGeneric />} />
                <Route path="applications" element={<AdminGeneric />} />
                <Route path="pages" element={<AdminGeneric />} />
                <Route path="projects" element={<AdminGeneric />} />
                <Route path="gallery" element={<AdminGeneric />} />
                <Route path="videos" element={<AdminGeneric />} />
                <Route path="faqs" element={<AdminGeneric />} />
                <Route path="quotations" element={<AdminGeneric />} />
                <Route path="bookings" element={<AdminGeneric />} />
                <Route path="dealers" element={<AdminGeneric />} />
                <Route path="team" element={<AdminGeneric />} />
                <Route path="careers" element={<AdminGeneric />} />
                <Route path="analytics" element={<AdminGeneric />} />
                <Route path="redirects" element={<AdminGeneric />} />
                <Route path="emails" element={<AdminGeneric />} />
                <Route path="menus" element={<AdminGeneric />} />
                <Route path="integrations" element={<AdminGeneric />} />
                <Route path="audit-logs" element={<AdminGeneric />} />`;

content = content.replace(
  '<Route path="users" element={<AdminUsers />} />',
  '<Route path="users" element={<AdminUsers />} />' + additionalRoutes
);

fs.writeFileSync('src/App.tsx', content);
