import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { CATEGORIES_DATA } from "../data";
import { Network, Search, ExternalLink } from "lucide-react";
import { SEO } from "../components/SEO";

export function SitemapViewer() {
  const tree = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Brands", path: "/brands" },
    { 
      name: "Products", 
      path: "/products",
      children: CATEGORIES_DATA.map(c => ({
        name: c.name,
        path: `/products?category=${c.id}`
      }))
    },
    { name: "VADO Collection", path: "/vado-collection" },
    { name: "Catalogues", path: "/catalogues" },
    { name: "News and Blogs", path: "/news" },
    { name: "Showrooms", path: "/showrooms" },
    { name: "Contact Us", path: "/contact" }
  ];

  return (
    <div className="flex-grow bg-stone-950 text-stone-300 py-20 font-mono">
      <SEO title="Sitemap | AZM Group" description="Sitemap of AZM Group's Web Architecture." />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center gap-4 mb-16 pb-8 border-b border-stone-800">
           <Network className="text-stone-400" size={32} />
           <div>
             <h1 className="text-2xl text-white font-semibold flex items-center gap-3">
               AZM Group <span className="text-stone-600 text-sm font-normal">/ Enterprise Architecture</span>
             </h1>
             <p className="text-sm text-stone-500 mt-1">Information Architecture & Sitemap Mapping</p>
           </div>
        </div>

        <div className="max-w-4xl">
          <ul className="space-y-2">
            <li>
              <div className="flex items-center gap-4 py-2 hover:bg-stone-900 px-4 rounded transition-colors group">
                <span className="text-stone-500">{"[R]"}</span>
                <Link to="/" className="text-white hover:underline flex-grow">AZM Group Root Map</Link>
              </div>
              <ul className="pl-12 mt-2 space-y-2 border-l border-stone-800 ml-6 relative">
                {tree.map((node, i) => (
                  <motion.li 
                    key={node.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="relative"
                  >
                    <div className="absolute w-6 border-t border-stone-800 -left-px top-1/2"></div>
                    
                    <div className="pl-8 flex items-center gap-4 py-2 hover:bg-stone-900 pr-4 rounded transition-colors group">
                       <span className="text-stone-500 text-xs">{(i + 1).toString().padStart(2, '0')}</span>
                       <Link to={node.path} className="text-stone-300 hover:text-white flex-grow font-medium flex items-center gap-2">
                         {node.name}
                         <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 text-stone-500" />
                       </Link>
                    </div>

                    {/* Children */}
                    {node.children && (
                      <ul className="pl-[4.5rem] mt-2 space-y-1 mb-6 border-l border-stone-800/50 ml-10">
                        {node.children.map((child, j) => (
                           <motion.li 
                             key={child.name}
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             transition={{ delay: (i * 0.05) + (j * 0.02) }}
                             className="relative"
                           >
                             <div className="absolute w-4 border-t border-stone-800/50 -left-px top-1/2"></div>
                             <Link 
                               to={child.path}
                               className="pl-6 py-1.5 flex items-center gap-3 text-sm text-stone-500 hover:text-stone-300 transition-colors group"
                             >
                                <span className="text-stone-700 text-[10px]">↳</span>
                                {child.name}
                             </Link>
                           </motion.li>
                        ))}
                      </ul>
                    )}
                  </motion.li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
