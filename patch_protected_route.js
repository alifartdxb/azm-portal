import fs from 'fs';
let content = fs.readFileSync('src/components/ProtectedRoute.tsx', 'utf8');

content = content.replace(
  "const { user, role, loading } = useAuth();",
  "const { user, role, status, loading, logout } = useAuth();"
);

const oldStatusCheck = `  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }`;

const newStatusCheck = `  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (status === 'inactive') {
    // If inactive, maybe auto logout or just redirect to login with a message
    logout();
    return <Navigate to="/admin/login" state={{ from: location, error: "Your account has been deactivated." }} replace />;
  }`;

content = content.replace(oldStatusCheck, newStatusCheck);

fs.writeFileSync('src/components/ProtectedRoute.tsx', content);
