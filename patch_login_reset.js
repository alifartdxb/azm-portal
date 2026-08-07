import fs from 'fs';
let content = fs.readFileSync('src/pages/admin/auth/Login.tsx', 'utf8');

// Add sendPasswordResetEmail to imports
content = content.replace(
  "import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';",
  "import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';"
);

// Add state for reset
content = content.replace(
  "const [showPassword, setShowPassword] = useState(false);",
  "const [showPassword, setShowPassword] = useState(false);\n  const [resetMessage, setResetMessage] = useState('');"
);

// Add handleReset function
const handleResetCode = `  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    setLoading(true);
    setError('');
    setResetMessage('');
    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage('Password reset link sent to your email.');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };`;

content = content.replace(
  "const handleSubmit = async (e: React.FormEvent) => {",
  handleResetCode + "\n\n  const handleSubmit = async (e: React.FormEvent) => {"
);

// Add success message display
content = content.replace(
  "{error && (",
  `{resetMessage && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg flex items-start gap-2 text-sm mb-6 border border-green-100">
              <span className="mt-0.5 flex-shrink-0">✓</span>
              <span>{resetMessage}</span>
            </div>
          )}
          {error && (`
);

// Add forgot password onClick
content = content.replace(
  `<button type="button" className="text-xs font-bold text-brand-primary hover:underline">Forgot?</button>`,
  `<button type="button" onClick={handleResetPassword} className="text-xs font-bold text-brand-primary hover:underline">Forgot?</button>`
);

fs.writeFileSync('src/pages/admin/auth/Login.tsx', content);
