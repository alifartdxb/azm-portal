import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

const importsToAdd = `
const Projects = lazy(() => import("./pages/Projects").then(module => ({ default: module.Projects })));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail").then(module => ({ default: module.ProjectDetail })));
const FAQs = lazy(() => import("./pages/FAQs").then(module => ({ default: module.FAQs })));
const Careers = lazy(() => import("./pages/Careers").then(module => ({ default: module.Careers })));
`;

content = content.replace(
  'const AdminCareers = lazy(() => import("./pages/admin/AdminCareers").then(module => ({ default: module.AdminCareers })));',
  'const AdminCareers = lazy(() => import("./pages/admin/AdminCareers").then(module => ({ default: module.AdminCareers })));\n' + importsToAdd
);

// Add routes
content = content.replace(
  '<Route path="vado-collection" element={<VadoCollection />} />',
  '<Route path="vado-collection" element={<VadoCollection />} />\n              <Route path="projects" element={<Projects />} />\n              <Route path="projects/:slug" element={<ProjectDetail />} />\n              <Route path="faqs" element={<FAQs />} />\n              <Route path="careers" element={<Careers />} />'
);

fs.writeFileSync('src/App.tsx', content);
