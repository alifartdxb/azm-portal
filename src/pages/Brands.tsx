import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { SEO } from '../components/SEO';
import { OptimizedImage } from '../components/OptimizedImage';
import { BRANDS_DATA } from '../data';
import { getCollection } from '../services/db';
import { ArrowRight } from 'lucide-react';

export function Brands() {
  const [brands, setBrands] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function loadBrands() {
      try {
        const data = await getCollection('brands');
        const active = data.filter((b: any) => b.status !== 'Draft');
        setBrands(active.length > 0 ? active : BRANDS_DATA);
      } catch (e) {
        setBrands(BRANDS_DATA);
      }
    }
    loadBrands();
  }, []);
  return (
    <div className="flex-grow flex flex-col bg-stone-50 overflow-hidden">
      <SEO 
        title="Our Premium Brands | AZM Group"
        description="Discover our collection of premium bathroom and kitchen solution brands including VADO, Jaquar, and more."
        keywords={["Brands", "VADO", "Jaquar", "Sanitary Ware Brands", "Bathroom Brands Dubai"]}
      />

      <section className="pt-32 pb-16 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-brand-secondary mb-6">Our Premium Brands</h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            We partner with the world's leading manufacturers to bring you unparalleled quality, design, and innovation for your building projects.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {brands.map((brand, idx) => (
              <motion.div 
                key={brand.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link to={`/brands/${brand.slug}`} className="group block bg-white rounded-2xl overflow-hidden border border-stone-200 hover:shadow-xl transition-all duration-300">
                  <div className="aspect-[16/9] relative overflow-hidden bg-stone-100">
                    <OptimizedImage 
                      src={brand.banner} 
                      alt={brand.name} 
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-sm">
                        <OptimizedImage src={brand.logo} alt={`${brand.name} Logo`} className="h-8 w-auto object-contain" fallbackSrc={`https://via.placeholder.com/150x50?text=${brand.name}`} />
                      </div>
                      <span className="text-white text-xs font-bold uppercase tracking-wider">{brand.country}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-brand-secondary mb-2 group-hover:text-brand-primary transition-colors">{brand.name}</h3>
                    <p className="text-stone-600 text-sm line-clamp-2 mb-4">{brand.description}</p>
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-brand-primary uppercase tracking-wider group-hover:gap-2 transition-all">
                      Explore Products <ArrowRight size={16} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
