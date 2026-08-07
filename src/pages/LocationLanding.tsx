import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { getCollection } from '../services/db';
import { SEO } from '../components/SEO';
import { OptimizedImage } from '../components/OptimizedImage';
import { ArrowRight, MapPin, CheckCircle2 } from 'lucide-react';

const formatCityName = (slug: string) => {
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export function LocationLanding() {
  const { city } = useParams<{ city: string }>();
  const [products, setProducts] = useState<any[]>([]);
  const cityName = formatCityName(city || 'Dubai');
  
  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getCollection('products');
        setProducts(data.filter((p: any) => p.status !== 'Draft').slice(0, 8));
      } catch (err) {}
    }
    fetchProducts();
  }, [city]);

  const seoTitle = `Premium Building Materials & Sanitary Ware Supplier in ${cityName} | AZM Group`;
  const seoDesc = `AZM Group is the leading supplier of high-quality tiles, sanitary ware, bathroom fittings, and building materials for residential and commercial projects in ${cityName}. Contact us for a quote.`;

  return (
    <>
      <SEO 
        title={seoTitle}
        description={seoDesc}
        canonical={`https://www.azmgroup.ae/locations/${city}`}
        
        schemas={[{ "@context": "https://schema.org", "@type": "LocalBusiness", 
          "name": `AZM Group ${cityName}`,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": cityName,
            "addressCountry": "AE"
          },
          "url": `https://www.azmgroup.ae/locations/${city}`
        }]}

      />
      <div className="pt-24 pb-16 bg-stone-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <OptimizedImage src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2000&auto=format&fit=crop" alt={`${cityName} skyline`} className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
              Premium Building Materials Supplier in {cityName}
            </h1>
            <p className="text-xl text-stone-300 mb-8 leading-relaxed">
              AZM Group brings world-class sanitary ware, porcelain slabs, and architectural finishing products to {cityName}'s most prestigious residential and commercial projects.
            </p>
            <div className="flex gap-4">
              <Link to="/products" className="px-8 py-4 bg-brand-primary text-white font-bold tracking-wider uppercase text-sm hover:bg-brand-secondary transition-colors">
                Explore Products
              </Link>
              <Link to="/contact" className="px-8 py-4 bg-white/10 backdrop-blur border border-white/20 text-white font-bold tracking-wider uppercase text-sm hover:bg-white/20 transition-colors">
                Contact Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-display font-bold text-stone-900 mb-6">Elevating Spaces in {cityName}</h2>
              <p className="text-stone-600 mb-6 leading-relaxed">
                As a trusted partner for architects, interior designers, and contractors in {cityName}, we understand the unique demands of the local market. Our extensive portfolio includes exclusive European and international brands designed to meet the highest standards of luxury and durability.
              </p>
              <ul className="space-y-4 mb-8">
                {['Dedicated B2B Trade Support', 'Fast Delivery Across ' + cityName, 'Exclusive access to premium brands like VADO & Jaquar', 'Comprehensive Technical Documentation'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-stone-700 font-medium">
                    <CheckCircle2 className="text-brand-primary shrink-0" size={20} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-stone-50 p-8 md:p-12 border border-stone-100">
              <h3 className="text-xl font-bold font-display text-stone-900 mb-6 border-b border-stone-200 pb-4">Our Core Supply Categories in {cityName}</h3>
              <div className="grid grid-cols-2 gap-4">
                {['Sanitary Ware', 'Bathroom Fittings', 'Shower Systems', 'Porcelain Tiles', 'Marble & Natural Stone', 'Kitchen Mixers', 'Water Closets', 'Installation Materials'].map((cat, i) => (
                  <Link key={i} to="/categories" className="flex items-center gap-2 text-stone-600 hover:text-brand-primary font-medium transition-colors text-sm">
                    <ArrowRight size={14} /> {cat}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-24 bg-stone-50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-display font-bold text-stone-900 mb-4">Popular in {cityName}</h2>
              <p className="text-stone-600">Discover the products currently trending among local contractors and designers.</p>
            </div>
            <Link to="/products" className="hidden md:flex items-center gap-2 text-brand-primary font-bold hover:text-brand-secondary transition-colors">
              View Complete Catalog <ArrowRight size={20} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map(p => (
              <Link key={p.id} to={`/products/${p.brand?.toLowerCase() || 'brand'}/${p.category?.toLowerCase() || 'category'}/${p.slug || p.sku}`} className="group bg-white border border-stone-200 hover:border-brand-primary transition-colors">
                <div className="aspect-square bg-stone-100 p-6">
                  <OptimizedImage src={p.mainImage || p.images?.[0]} alt={p.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block mb-1">{p.brand}</span>
                  <h3 className="font-bold text-stone-800 text-sm line-clamp-2">{p.name || p.sku}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="py-24 bg-brand-secondary text-white">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <MapPin size={48} className="mx-auto text-brand-primary mb-6" />
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Ready to start your project in {cityName}?</h2>
          <p className="text-xl text-white/80 mb-10">Get in touch with our local sales consultants for expert advice and competitive trade pricing.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="https://wa.me/971558090292" target="_blank" rel="noreferrer" className="px-8 py-4 bg-[#25D366] text-white font-bold tracking-wider uppercase text-sm hover:bg-[#128C7E] transition-colors">
              WhatsApp Inquiry
            </a>
            <Link to="/contact" className="px-8 py-4 bg-white text-brand-secondary font-bold tracking-wider uppercase text-sm hover:bg-stone-200 transition-colors">
              Request a Quotation
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
