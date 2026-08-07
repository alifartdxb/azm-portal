const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add import
content = content.replace(/const NotFoundPage = lazy\(\(\) => import\("\.\/pages\/NotFoundPage"\)\.then\(module => \(\{ default: module\.NotFoundPage \}\)\)\);/, 'const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then(module => ({ default: module.NotFoundPage })));\nconst StyleGuide = lazy(() => import("./pages/StyleGuide").then(module => ({ default: module.StyleGuide })));');

// Add route
content = content.replace(/<Route path="blog\/:slug" element=\{<BlogDetail \/>\} \/>/, '<Route path="blog/:slug" element={<BlogDetail />} />\n              <Route path="style-guide" element={<StyleGuide />} />');

fs.writeFileSync('src/App.tsx', content);
