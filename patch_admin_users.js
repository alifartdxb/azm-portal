import fs from 'fs';
let content = fs.readFileSync('src/pages/admin/AdminUsers.tsx', 'utf8');

// Update role checks
content = content.replace(
  "if (role !== 'admin' && role !== 'superadmin') {",
  "if (role !== 'super_admin') {"
);

// Update select options
const oldSelect = `<select
                        value={u.role || 'viewer'}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        disabled={role !== 'superadmin' && u.role === 'superadmin'}
                        className="bg-stone-100 border-none rounded-lg px-3 py-1 text-sm text-stone-700 font-medium focus:ring-2 focus:ring-brand-primary cursor-pointer"
                      >
                        <option value="viewer">Viewer</option>
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Super Admin</option>
                      </select>`;

const newSelect = `<select
                        value={u.role || 'viewer'}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        disabled={role !== 'super_admin'}
                        className="bg-stone-100 border-none rounded-lg px-3 py-1 text-sm text-stone-700 font-medium focus:ring-2 focus:ring-brand-primary cursor-pointer"
                      >
                        <option value="viewer">Viewer (Read-only)</option>
                        <option value="content_manager">Content Manager</option>
                        <option value="sales_manager">Sales Manager</option>
                        <option value="seo_manager">SEO Manager</option>
                        <option value="super_admin">Super Admin</option>
                      </select>`;

content = content.replace(oldSelect, newSelect);

fs.writeFileSync('src/pages/admin/AdminUsers.tsx', content);
