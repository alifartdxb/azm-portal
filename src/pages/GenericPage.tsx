import { useParams, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SEO } from "../components/SEO";

export function GenericPage({ title, subtitle }: { title?: string, subtitle?: string }) {
  const location = useLocation();
  const path = location.pathname.split('/').filter(Boolean).map(p => p.replace(/-/g, ' '));
  const pageTitle = title || path[path.length - 1] || "Page";
  
  return (
    <div className="flex-grow flex flex-col pt-10">
      <SEO title={`${pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1)} | AZM Group`} />
      {/* Page Header */}
      <div className="bg-stone-50 py-16 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-medium uppercase tracking-widest text-stone-500 mb-4 flex items-center gap-2">
             <Link to="/" className="hover:text-stone-900">Home</Link>
             <span>/</span>
             <span className="text-stone-900 capitalize">{pageTitle}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-stone-900 capitalize font-serif">{pageTitle}</h1>
          {subtitle && <p className="mt-4 text-lg text-stone-600 max-w-2xl">{subtitle}</p>}
        </div>
      </div>

      {/* Placeholder Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex-grow w-full">
         <div className="border border-dashed border-stone-300 p-16 text-center bg-stone-50 flex flex-col items-center justify-center">
            <h2 className="text-2xl font-medium text-stone-700 mb-2 capitalize">{pageTitle} Section</h2>
            <p className="text-stone-500 mb-8 max-w-md mx-auto">This architectural node is mapped in the enterprise sitemap. Content will be populated in the production phase.</p>
            <Link to="/" className="inline-flex items-center gap-2 text-stone-900 font-semibold uppercase tracking-wider hover:underline underline-offset-4">
              Return to Catalog <ArrowRight size={16} />
            </Link>
         </div>
      </div>
    </div>
  );
}
