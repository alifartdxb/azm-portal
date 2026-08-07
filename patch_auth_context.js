import fs from 'fs';
let content = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

// Add status to context
content = content.replace(
  "role: string | null;",
  "role: string | null;\n  status: string | null;"
);
content = content.replace(
  "const AuthContext = createContext<AuthContextType>({ user: null, role: null, loading: true, logout: async () => {} });",
  "const AuthContext = createContext<AuthContextType>({ user: null, role: null, status: null, loading: true, logout: async () => {} });"
);

content = content.replace(
  "const [role, setRole] = useState<string | null>(null);",
  "const [role, setRole] = useState<string | null>(null);\n  const [status, setStatus] = useState<string | null>(null);"
);

const oldFetchLogic = `if (userDoc.exists()) {
            setRole(userDoc.data().role);
          } else {
            setRole('viewer'); // default role
          }`;

const newFetchLogic = `if (userDoc.exists()) {
            const data = userDoc.data();
            setRole(data.role);
            setStatus(data.status || 'active');
          } else {
            setRole('viewer'); // default role
            setStatus('active');
          }`;

content = content.replace(oldFetchLogic, newFetchLogic);

content = content.replace(
  "setRole(null);",
  "setRole(null);\n        setStatus(null);"
);

content = content.replace(
  "value={{ user, role, loading, logout }}",
  "value={{ user, role, status, loading, logout }}"
);

fs.writeFileSync('src/contexts/AuthContext.tsx', content);
