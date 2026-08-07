import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Search, Loader2 } from 'lucide-react';

export function NotFoundPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkRedirect() {
      try {
        const path = location.pathname;
        const q = query(collection(db, 'redirects'), where('source', '==', path), where('status', '==', 'active'));
        const snap = await getDocs(q);
        
        if (!snap.empty) {
          const redirect = snap.docs[0].data();
          window.location.replace(redirect.destination); // Using replace to avoid history loops
          return;
        }

        // If no redirect, log 404
        await addDoc(collection(db, 'broken_links'), {
          path: location.pathname,
          referrer: document.referrer || '',
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          resolved: false
        });
      } catch (err) {}
      setChecking(false);
    }
    checkRedirect();
  }, [location.pathname, navigate]);

  if (checking) return <div className="min-h-screen flex justify-center pt-32"><Loader2 className="animate-spin text-brand-primary" size={32} /></div>;

  return (
    <>
      <SEO 
        title="Page Not Found | AZM Group"
        description="The page you are looking for does not exist."
        index={false}
      />
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-stone-50 px-6 py-24 text-center">
        <h1 className="text-8xl md:text-9xl font-display font-bold text-brand-primary mb-6">404</h1>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-stone-900 mb-4">Page Not Found</h2>
        <p className="text-stone-600 mb-8 max-w-md mx-auto">
          We're sorry, the page you're looking for cannot be found. It might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/" className="px-8 py-4 bg-brand-primary text-white font-bold uppercase tracking-wider text-sm hover:bg-brand-secondary transition-colors">
            Return to Homepage
          </Link>
          <Link to="/products" className="px-8 py-4 bg-white border border-stone-200 text-stone-900 font-bold uppercase tracking-wider text-sm hover:border-brand-primary transition-colors">
            Browse Products
          </Link>
        </div>
        
        <div className="mt-16 w-full max-w-md">
          <p className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-4">Search our catalogue</p>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input
              type="text"
              placeholder="E.g., Bathroom Mixer, Porcelain Tiles..."
              className="w-full pl-12 pr-4 py-3 border border-stone-200 rounded-full focus:outline-none focus:border-brand-primary"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  window.location.href = `/products?q=${encodeURIComponent(e.currentTarget.value)}`;
                }
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
