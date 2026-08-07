const fs = require('fs');
let code = fs.readFileSync('src/components/ProtectedRoute.tsx', 'utf8');

const replacement = `  if (allowedRoles) {
    const userRole = role ? (Array.isArray(role) ? role[0] : role) : 'viewer';
    // super_admin always has access
    if (userRole !== 'super_admin' && !allowedRoles.includes(userRole as string)) {
      return <Unauthorized />;
    }
  }`;

code = code.replace(
  "  if (allowedRoles && role) {\n    const userRole = Array.isArray(role) ? role[0] : role;\n    // super_admin always has access\n    if (userRole !== 'super_admin' && !allowedRoles.includes(userRole as string)) {\n      return <Unauthorized />;\n    }\n  }",
  replacement
);

fs.writeFileSync('src/components/ProtectedRoute.tsx', code);
