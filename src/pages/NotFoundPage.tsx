import { Link } from "react-router-dom";
import { Home, Package, Mail } from "lucide-react";
import { SEO } from "../components/SEO";

export function NotFoundPage() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center py-32 px-4 bg-stone-50 text-center">
      <SEO title="Page Not Found | AZM Group" description="Sorry, this page is unavailable." />
      
      <div className="max-w-xl mx-auto">
        <h1 className="text-8xl md:text-9xl font-bold font-display text-brand-primary/20 mb-4 tracking-tighter">404</h1>
        <h2 className="text-3xl md:text-4xl font-bold font-display text-stone-900 mb-6">Page Not Found</h2>
        <p className="text-stone-500 text-lg mb-12 max-w-md mx-auto leading-relaxed">
          Sorry, this page is unavailable. The link you followed may be broken, or the page may have been removed.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/" 
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-primary text-white px-8 py-4 rounded-lg font-bold uppercase tracking-wider hover:bg-brand-secondary transition-all shadow-sm hover:shadow-md"
          >
            <Home size={18} /> Return Home
          </Link>
          <Link 
            to="/products" 
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-stone-700 border border-stone-200 px-8 py-4 rounded-lg font-bold uppercase tracking-wider hover:bg-stone-50 hover:text-brand-primary transition-all shadow-sm"
          >
            <Package size={18} /> Browse Products
          </Link>
          <Link 
            to="/contact" 
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-stone-700 border border-stone-200 px-8 py-4 rounded-lg font-bold uppercase tracking-wider hover:bg-stone-50 hover:text-brand-primary transition-all shadow-sm"
          >
            <Mail size={18} /> Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
