import { useLocation } from "react-router-dom";
import { Hammer } from "lucide-react";

export function AdminGeneric() {
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const moduleName = pathParts[pathParts.length - 1];
  
  // Format module name (e.g., 'seo' -> 'SEO Manager', 'users' -> 'Users & Roles')
  const formatTitle = (name: string) => {
    switch(name) {
      case 'seo': return 'SEO Manager';
      case 'users': return 'Users & Roles';
      case 'media': return 'Media Library';
      default: return name.charAt(0).toUpperCase() + name.slice(1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 mb-6 border border-stone-200">
        <Hammer size={32} />
      </div>
      <h1 className="text-3xl font-bold text-stone-800 mb-2">{formatTitle(moduleName)} Module</h1>
      <p className="text-stone-500 max-w-md">
        This module is part of the enterprise architecture and is currently being provisioned. 
        It will connect to the central backend services for {formatTitle(moduleName).toLowerCase()} management.
      </p>
      <button className="mt-8 px-6 py-2 border border-stone-300 text-stone-600 rounded-lg text-sm font-semibold hover:bg-stone-50 transition-colors">
        View Integration Docs
      </button>
    </div>
  );
}
