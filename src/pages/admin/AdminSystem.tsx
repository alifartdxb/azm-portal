import { useState } from 'react';
import { getCollection, updateDocument } from '../../services/db';
import { ShieldAlert, CheckCircle, RefreshCw, AlertTriangle } from 'lucide-react';

export function AdminSystem() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isRepairing, setIsRepairing] = useState(false);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

    const repairProducts = async () => {
    if (!window.confirm("Are you sure you want to run the product repair utility? This will update products missing slugs or required fields.")) {
      return;
    }
    
    setIsRepairing(true);
    setLogs([]);
    addLog("Starting product repair process...");
    
    try {
      const products = await getCollection('products') as any[];
      addLog(`Found ${products.length} products to check.`);
      
      let fixedCount = 0;
      
      const existingSlugs = new Set();
      // First pass: collect all valid existing slugs
      for (const p of products) {
        if (p.urlSlug) existingSlugs.add(p.urlSlug);
        else if (p.slug) existingSlugs.add(p.slug);
      }
      
      const generateUniqueSlug = (baseSlug) => {
        let slug = baseSlug;
        let counter = 1;
        while (existingSlugs.has(slug)) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }
        existingSlugs.add(slug);
        return slug;
      };
      
      for (const product of products) {
        let needsUpdate = false;
        const updates: any = {};
        
        let targetSlug = product.urlSlug || product.slug;
        if (!targetSlug && product.name) {
           let baseSlug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
           if (product.sku) {
             baseSlug += '-' + product.sku.toLowerCase().replace(/[^a-z0-9]+/g, '-');
           }
           baseSlug = baseSlug.replace(/^-+|-+$/g, ''); // Trim dashes
           if (!baseSlug) baseSlug = 'product-' + Math.random().toString(36).substring(7);
           
           targetSlug = generateUniqueSlug(baseSlug);
           updates.urlSlug = targetSlug;
           needsUpdate = true;
           addLog(`Generated unique urlSlug for ${product.name} -> ${targetSlug}`);
        }

        // Fix missing slug
        if (!product.slug && targetSlug) {
          updates.slug = targetSlug;
          needsUpdate = true;
          addLog(`Fixed missing slug for ${product.name} -> ${targetSlug}`);
        }
        
        // Fix missing urlSlug if it has slug but no urlSlug
        if (!product.urlSlug && targetSlug) {
          updates.urlSlug = targetSlug;
          needsUpdate = true;
          addLog(`Fixed missing urlSlug for ${product.name} -> ${targetSlug}`);
        }
        
        // Ensure seo properties exist
        if (!product.seoTitle) {
          updates.seoTitle = product.name || 'Premium Product';
          needsUpdate = true;
          addLog(`Generated SEO title for ${product.name || 'Product'}`);
        }
        
        if (!product.metaDescription) {
          let shortDesc = product.shortDescription;
          if (!shortDesc && product.description) {
            shortDesc = product.description.replace(/<[^>]*>?/gm, '').substring(0, 150);
          }
          updates.metaDescription = shortDesc || (product.name ? `Buy ${product.name} from AZM Group.` : 'Explore our premium products.');
          needsUpdate = true;
          addLog(`Generated meta description for ${product.name || 'Product'}`);
        }

        if (needsUpdate) {
          await updateDocument('products', product.id, updates);
          fixedCount++;
        }
      }
      
      addLog(`Repair complete. Fixed ${fixedCount} products.`);
    } catch (error) {
      addLog(`ERROR: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsRepairing(false);
    }
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">System Tools & Repair</h1>
        <p className="text-stone-500">Run diagnostic and repair scripts to fix data inconsistencies.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-primary/10 rounded-lg text-brand-primary">
              <RefreshCw size={24} />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-lg mb-1">Repair Product Pages</h3>
              <p className="text-sm text-stone-600 mb-4">
                Scans all products and fixes missing URLs, SEO data, and generates unique slugs for products that don't have them (e.g. imported products).
              </p>
              <button 
                onClick={repairProducts}
                disabled={isRepairing}
                className="bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-secondary transition-colors disabled:opacity-50"
              >
                {isRepairing ? 'Running...' : 'Run Repair Utility'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-lg mb-1">Clear Cache (Coming Soon)</h3>
              <p className="text-sm text-stone-600 mb-4">
                Forces a rebuild of the frontend cache and search index to ensure all products are synced.
              </p>
              <button 
                disabled
                className="bg-stone-200 text-stone-500 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
              >
                Clear Cache
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-stone-900 rounded-xl p-6 shadow-sm flex flex-col h-96">
        <h3 className="font-mono font-bold text-stone-100 mb-4 flex items-center gap-2">
          <ShieldAlert size={16} className="text-green-400" /> System Logs
        </h3>
        <div className="flex-1 overflow-y-auto bg-black/50 rounded-lg p-4 font-mono text-sm text-green-400 space-y-1">
          {logs.length === 0 ? (
            <p className="text-stone-500 italic">No logs to display. Run a utility to see output.</p>
          ) : (
            logs.map((log, i) => (
              <div key={i}>{log}</div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
