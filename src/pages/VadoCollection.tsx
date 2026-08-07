import { Link } from "react-router-dom";
import { ArrowRight, Droplet, Star, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { SEO } from "../components/SEO";

export function VadoCollection() {
  return (
    <div className="flex-grow flex flex-col bg-white">
      <SEO 
        title="VADO UK Collection | Premium British Brassware UAE | AZM Group"
        description="Discover the VADO UK collection at AZM Group. Precision engineering, rigorous quality testing, and striking contemporary design for prestigious properties across the UAE."
      />
      {/* Vado Hero */}
      <div className="relative h-[70vh] bg-stone-900 flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-900/80 to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
             className="max-w-2xl text-white"
           >
             <h2 className="text-xl tracking-[0.3em] uppercase mb-4 text-stone-400 font-semibold text-white">VADO UK</h2>
             <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 font-serif">British Excellence <br/>in Brassware.</h1>
             <p className="text-lg text-stone-400 mb-8 max-w-lg leading-relaxed">
               Discover precision engineering, rigorous quality testing, and striking contemporary design. The definitive choice for prestigious properties across the UAE.
             </p>
             <button className="bg-white text-stone-900 px-8 py-4 text-sm font-semibold uppercase tracking-wider hover:bg-stone-200 transition-colors">
               Inquire For Projects
             </button>
           </motion.div>
        </div>
      </div>

      {/* Attributes */}
      <div className="bg-stone-50 py-20 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
             <div className="flex flex-col items-center text-center">
               <div className="w-16 h-16 rounded-full bg-stone-200 flex items-center justify-center text-stone-700 mb-6">
                 <ShieldCheck size={32} />
               </div>
               <h3 className="text-xl font-bold tracking-tight mb-3">12 Year Guarantee</h3>
               <p className="text-stone-600 text-sm leading-relaxed">VADO products undergo strict quality assurance processes, backed by an industry-leading guarantee.</p>
             </div>
             <div className="flex flex-col items-center text-center">
               <div className="w-16 h-16 rounded-full bg-stone-200 flex items-center justify-center text-stone-700 mb-6">
                 <Droplet size={32} />
               </div>
               <h3 className="text-xl font-bold tracking-tight mb-3">H2Eco Technology</h3>
               <p className="text-stone-600 text-sm leading-relaxed">Advanced flow regulators that reduce water consumption without compromising the luxury experience.</p>
             </div>
             <div className="flex flex-col items-center text-center">
               <div className="w-16 h-16 rounded-full bg-stone-200 flex items-center justify-center text-stone-700 mb-6">
                 <Star size={32} />
               </div>
               <h3 className="text-xl font-bold tracking-tight mb-3">Award Winning Design</h3>
               <p className="text-stone-600 text-sm leading-relaxed">Recognized globally for aesthetic excellence, bringing timeless sophistication to any bathroom.</p>
             </div>
           </div>
        </div>
      </div>
      
      {/* Product Teasers */}
      <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">VADO Collections</h2>
            <p className="text-stone-500 max-w-2xl mx-auto">Explore the distinct ranges designed to elevate your architectural vision.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link to="/products/bathroom-faucets" className="group bg-stone-100 aspect-video relative overflow-hidden flex items-end p-8 border border-stone-200 hover:border-stone-400 transition-colors">
               <div className="relative z-10">
                 <h3 className="text-2xl font-bold text-stone-900 mb-2">Individual by VADO</h3>
                 <p className="text-stone-600 mb-4">Brushed Gold, Brushed Nickel, and Chrome finishes.</p>
                 <span className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-stone-900 group-hover:gap-4 transition-all">
                   View Range <ArrowRight size={16} />
                 </span>
               </div>
            </Link>
            <Link to="/products/shower-systems" className="group bg-stone-100 aspect-video relative overflow-hidden flex items-end p-8 border border-stone-200 hover:border-stone-400 transition-colors">
               <div className="relative z-10">
                 <h3 className="text-2xl font-bold text-stone-900 mb-2">Sensori Smart Dial</h3>
                 <p className="text-stone-600 mb-4">Digital shower controls for precision temperature mapping.</p>
                 <span className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-stone-900 group-hover:gap-4 transition-all">
                   View Range <ArrowRight size={16} />
                 </span>
               </div>
            </Link>
         </div>
      </div>

    </div>
  );
}
