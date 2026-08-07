const fs = require('fs');
let code = fs.readFileSync('src/components/ProtectedRoute.tsx', 'utf8');

code = code.replace(
  "  if (allowedRoles && role) {",
  "  if (allowedRoles && role) {\n    const userRole = Array.isArray(role) ? role[0] : role;"
);

code = code.replace(
  "if (role !== 'super_admin' && !allowedRoles.includes(role)) {",
  "if (userRole !== 'super_admin' && !allowedRoles.includes(userRole as string)) {"
);

fs.writeFileSync('src/components/ProtectedRoute.tsx', code);
