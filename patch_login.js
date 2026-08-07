import fs from 'fs';
let content = fs.readFileSync('src/pages/admin/auth/Login.tsx', 'utf8');

// Update role creation logic
const oldRoleLogic = `const role = email.includes('admin') ? 'superadmin' : 'viewer';`;
const newRoleLogic = `const role = email.includes('admin') || email.includes('alifartdxb') ? 'super_admin' : 'viewer';`;

content = content.replace(oldRoleLogic, newRoleLogic);

fs.writeFileSync('src/pages/admin/auth/Login.tsx', content);
