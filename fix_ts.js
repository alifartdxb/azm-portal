import fs from 'fs';
let content = fs.readFileSync('src/pages/admin/projects/AdminProjectForm.tsx', 'utf8');
content = content.replace('if (data) {', 'if (data) {\n          const projData = data as any;');
content = content.replace('...data,', '...projData,');
content = content.replace('gallery: data.gallery || []', 'gallery: projData.gallery || []');
fs.writeFileSync('src/pages/admin/projects/AdminProjectForm.tsx', content);

let blogsList = fs.readFileSync('src/pages/admin/blogs/AdminBlogs.tsx', 'utf8');
blogsList = blogsList.replace('setBlogs(blogs.map(p => p.id === id ? { ...p, status: newStatus } : p));', 'setBlogs(blogs.map((p: any) => p.id === id ? { ...p, status: newStatus } : p));');
blogsList = blogsList.replace('const filteredBlogs = blogs.filter(p => ', 'const filteredBlogs = blogs.filter((p: any) => ');
fs.writeFileSync('src/pages/admin/blogs/AdminBlogs.tsx', blogsList);

let projList = fs.readFileSync('src/pages/admin/projects/AdminProjects.tsx', 'utf8');
projList = projList.replace('setProjects(projects.map(p => p.id === id ? { ...p, status: newStatus } : p));', 'setProjects(projects.map((p: any) => p.id === id ? { ...p, status: newStatus } : p));');
projList = projList.replace('const filteredProjects = projects.filter(p =>', 'const filteredProjects = projects.filter((p: any) =>');
fs.writeFileSync('src/pages/admin/projects/AdminProjects.tsx', projList);
