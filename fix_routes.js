import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add imports
const importsToAdd = `
const AdminProjects = lazy(() => import("./pages/admin/projects/AdminProjects").then(module => ({ default: module.AdminProjects })));
const AdminProjectForm = lazy(() => import("./pages/admin/projects/AdminProjectForm").then(module => ({ default: module.AdminProjectForm })));
const AdminBlogForm = lazy(() => import("./pages/admin/blogs/AdminBlogForm").then(module => ({ default: module.AdminBlogForm })));
const AdminFAQs = lazy(() => import("./pages/admin/AdminFAQs").then(module => ({ default: module.AdminFAQs })));
const AdminCareers = lazy(() => import("./pages/admin/AdminCareers").then(module => ({ default: module.AdminCareers })));
`;

content = content.replace(
  'const AdminLeads = lazy(() => import("./pages/admin/AdminLeads").then(module => ({ default: module.AdminLeads })));',
  'const AdminLeads = lazy(() => import("./pages/admin/AdminLeads").then(module => ({ default: module.AdminLeads })));\n' + importsToAdd
);

// Replace routes
content = content.replace('<Route path="blogs" element={<AdminBlogs />} />', '<Route path="blogs" element={<AdminBlogs />} />\n                  <Route path="blogs/add" element={<AdminBlogForm />} />\n                  <Route path="blogs/edit/:id" element={<AdminBlogForm />} />');
content = content.replace('<Route path="projects" element={<AdminGeneric />} />', '<Route path="projects" element={<AdminProjects />} />\n                  <Route path="projects/add" element={<AdminProjectForm />} />\n                  <Route path="projects/edit/:id" element={<AdminProjectForm />} />');
content = content.replace('<Route path="faqs" element={<AdminGeneric />} />', '<Route path="faqs" element={<AdminFAQs />} />');
content = content.replace('<Route path="careers" element={<AdminGeneric />} />', '<Route path="careers" element={<AdminCareers />} />');

fs.writeFileSync('src/App.tsx', content);

let layoutContent = fs.readFileSync('src/pages/admin/AdminLayout.tsx', 'utf8');
if (!layoutContent.includes('Briefcase')) {
  layoutContent = layoutContent.replace('import { LayoutDashboard', 'import { LayoutDashboard, Briefcase, FileText, Image as ImageIcon, BookOpen, MessageSquare, Video, FolderGit2, Menu');
}
fs.writeFileSync('src/pages/admin/AdminLayout.tsx', layoutContent);
