import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getCollection } from '../services/db';

const DEFAULT_BRANDS = [
  { name: 'VADO' }, { name: 'JAQUAR' }, { name: 'ITALIAN STANDARDS' }, { name: 'NOURK' },
  { name: 'SANIT' }, { name: 'SONET' }, { name: 'ROMAN' }, { name: 'KLUDI RAK' }
];

export function PartnerMarquee() {
  const [brands, setBrands] = useState<any[]>(DEFAULT_BRANDS);
  useEffect(() => {
    async function loadBrands() {
      try {
        const data = await getCollection('brands');
        if (data && data.length > 0) {
          const featured = data.filter((b: any) => b.status !== 'Draft');
          if (featured.length > 0) setBrands(featured);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadBrands();
  }, []);
  // Duplicate brands for seamless scrolling
  const marqueeBrands = [...brands, ...brands, ...brands];

  return (
    <section className="py-16 bg-white border-b border-stone-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-stone-400">Exclusive Partner Network</p>
      </div>
      
      <div className="relative w-full overflow-hidden" style={{ display: 'flex' }}>
        <div className="animate-marquee flex gap-8 whitespace-nowrap py-4 px-4 hover:[animation-play-state:paused]">
          {marqueeBrands.map((brand, i) => (
            <Link 
              key={i} 
              to={`/brands/${brand.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="group relative flex flex-col items-center justify-center w-64 h-32 bg-stone-50 rounded-2xl border border-stone-100 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-brand-primary/30 overflow-hidden"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="z-10 text-2xl font-display font-extrabold tracking-tighter text-stone-300 group-hover:text-brand-primary transition-colors duration-300">
                {brand.name}
              </div>
              
              <div className="absolute bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-secondary bg-white px-3 py-1 rounded-full shadow-sm">
                  View Brand
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
