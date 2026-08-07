import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/admin" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Set default role to viewer, first user can manually be upgraded in Firestore
        // Or if email matches our admin email, make them admin
        const role = email.includes('admin') ? 'superadmin' : 'viewer';
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: userCredential.user.email,
          role: role,
          createdAt: new Date().toISOString()
        });
      }
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="p-8 pb-6 bg-brand-secondary text-center relative">
          <div className="w-16 h-16 bg-white rounded-xl mx-auto flex items-center justify-center mb-4">
            <span className="text-2xl font-bold font-display text-brand-secondary">AZM</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{isLogin ? 'Admin Portal' : 'Create Account'}</h1>
          <p className="text-stone-300 text-sm">{isLogin ? 'Sign in to manage AZM Group products' : 'Register a new admin account'}</p>
        </div>
        
        <div className="p-8 pt-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-start gap-2 text-sm mb-6 border border-red-100">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                  placeholder="admin@alzahrabm.com"
                  required
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-stone-700">Password</label>
                {isLogin && <button type="button" className="text-xs font-bold text-brand-primary hover:underline">Forgot?</button>}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            {isLogin && (
              <div className="flex items-center gap-2 pt-2 pb-2">
                <input type="checkbox" id="remember" className="rounded text-brand-primary focus:ring-brand-primary" />
                <label htmlFor="remember" className="text-sm text-stone-600">Remember me for 30 days</label>
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-brand-primary text-white py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-brand-secondary transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center h-12 mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                isLogin ? 'Sign In' : 'Register'
              )}
            </button>

            <div className="text-center mt-4">
              <button 
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-stone-500 hover:text-brand-primary font-medium"
              >
                {isLogin ? "Don't have an account? Register" : "Already have an account? Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
