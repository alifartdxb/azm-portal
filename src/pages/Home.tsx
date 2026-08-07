import { Link } from "react-router-dom";
import { CATEGORIES_DATA, PRODUCTS_DATA, BRANDS_DATA } from "../data";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { ArrowRight, Download, Droplet, CheckCircle, MapPin, Beaker, ShieldCheck, Mail, ArrowUpRight, ChevronLeft, ChevronRight, Quote, MessageCircle, FileText, Settings, Layers, Zap, User, Search, Play, Pause, Search as SearchIcon, Plus, Minus, Users, Phone } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { SEO } from "../components/SEO";
import { OptimizedImage } from "../components/OptimizedImage";
import { PartnerMarquee } from "../components/PartnerMarquee";
import { TestimonialCarousel } from "../components/TestimonialCarousel";
import { getCollection } from "../services/db";

// Use the exact layout required by the user instructions
export function Home() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const faqs = [
    {
      question: "Do you supply building materials for commercial projects?",
      answer: "Yes, AZM Group specializes in B2B supply for commercial developments, hospitality projects, and large-scale residential communities across the UAE. We offer dedicated account managers and bulk procurement solutions."
    },
    {
      question: "Are your products covered by warranties?",
      answer: "Absolutely. Our premium European and international brands come with comprehensive manufacturer warranties, some extending up to 12 or 15 years depending on the specific collection and product type."
    },
    {
      question: "Can I request samples for my interior design project?",
      answer: "Yes, we provide sample services for architects, consultants, and interior designers. Please contact our sales team to arrange delivery of material swatches, tile samples, or finish options to your studio."
    },
    {
      question: "Do you offer technical support for installation?",
      answer: "We provide comprehensive technical documentation, installation guides, and CAD drawings. For complex project requirements, our technical team can coordinate with your contractors to ensure correct specification and installation."
    },
    {
      question: "How do I request a formal quotation?",
      answer: "You can request a quotation by clicking the 'Request Quotation' button on any product page, adding multiple items to your inquiry list, or by contacting our B2B sales team directly via WhatsApp or email with your BOQ (Bill of Quantities)."
    }
  ];

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="flex flex-col bg-white">
      <SEO 
        title="Premium Bathroom Solutions & Sanitary Ware UAE | AZM Group"
        description="Discover luxury tiles, slabs, sanitary ware, faucets and building materials from trusted international brands. Responsive B2B project consultation across the UAE."
      />
      
      {/* 3. Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-brand-dark overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-brand-dark/50 z-10 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent z-10 opacity-80"></div>
          <video 
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover opacity-80"
            autoPlay 
            muted 
            loop 
            playsInline
            poster="https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=2000&auto=format&fit=crop"
          >
            {/* Fallback to image if video fails or is low bandwidth, using a placeholder video for demo */}
            <source src="https://cdn.coverr.co/videos/coverr-modern-bathroom-interior-4158/1080p.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full pt-20 pb-16">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-heading font-bold text-white leading-[1.1] tracking-tight mb-6">
                Premium Surfaces and Bathroom Solutions for UAE Projects
              </h1>
              <p className="text-lg md:text-xl text-stone-200 mb-10 max-w-2xl font-sans leading-relaxed">
                Discover tiles, slabs, sanitary ware, faucets and building materials from trusted international brands, supported by responsive project consultation and supply across the UAE.
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Link to="/products" className="bg-brand-primary text-white px-8 py-4 rounded-sm font-semibold uppercase tracking-wider text-sm hover:bg-brand-secondary transition-colors text-center shadow-sm">
                Explore Products
              </Link>
              <Link to="/contact?tab=quote" className="bg-transparent border border-white text-white px-8 py-4 rounded-sm font-semibold uppercase tracking-wider text-sm hover:bg-white hover:text-brand-dark transition-colors text-center">
                Request a Quote
              </Link>
              <a href="https://wa.me/971558090292" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white px-8 py-4 rounded-sm font-semibold uppercase tracking-wider text-sm hover:bg-[#1DA851] transition-colors text-center flex items-center justify-center gap-2 shadow-sm">
                <MessageCircle size={18} /> WhatsApp Our Sales Team
              </a>
            </motion.div>
          </div>
        </div>

        {/* Video Controls */}
        <button 
          onClick={toggleVideo}
          className="absolute bottom-8 right-8 z-20 w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors backdrop-blur-md"
          aria-label={isVideoPlaying ? "Pause video" : "Play video"}
        >
          {isVideoPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
      </section>

      {/* 4. Trust Indicators */}
      <section className="bg-brand-secondary py-12 border-b border-brand-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <ShieldCheck className="text-brand-accent mb-3" size={32} />
              <h3 className="text-white font-heading font-bold text-lg mb-1">Genuine Brands</h3>
              <p className="text-brand-light/70 text-sm">Authorized distributors</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Zap className="text-brand-accent mb-3" size={32} />
              <h3 className="text-white font-heading font-bold text-lg mb-1">Fast Fulfillment</h3>
              <p className="text-brand-light/70 text-sm">UAE-wide project delivery</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Layers className="text-brand-accent mb-3" size={32} />
              <h3 className="text-white font-heading font-bold text-lg mb-1">Comprehensive Range</h3>
              <p className="text-brand-light/70 text-sm">Complete architectural solutions</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Users className="text-brand-accent mb-3" size={32} />
              <h3 className="text-white font-heading font-bold text-lg mb-1">Expert Support</h3>
              <p className="text-brand-light/70 text-sm">Dedicated B2B sales team</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Product-category explorer */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-brand-dark mb-4">Architectural Solutions</h2>
              <p className="text-lg text-stone-600 max-w-2xl font-sans">
                Browse our comprehensive portfolio of premium building materials and sanitary ware.
              </p>
            </div>
            <Link to="/products" className="group flex items-center gap-2 text-sm font-bold text-brand-primary uppercase tracking-wider">
              View All Categories <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES_DATA.slice(0, 8).map((cat) => (
              <Link key={cat.id} to={`/products/${cat.name.toLowerCase().replace(/\s+/g, '-')}`} className="group relative h-64 overflow-hidden rounded-sm bg-stone-200">
                <OptimizedImage 
                  src={cat.image || `https://placehold.co/600x400/e7e5e4/57534e?text=${cat.name}`} 
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-6">
                  <h3 className="text-xl font-heading font-bold text-white mb-1 group-hover:text-brand-accent transition-colors">{cat.name}</h3>
                  <p className="text-sm text-brand-light/80 flex items-center gap-2">
                    Explore collection <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Interactive product finder */}
      <section className="py-24 bg-white border-y border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-dark rounded-xl p-8 md:p-12 shadow-xl relative overflow-hidden">
            {/* Architectural accent */}
            <div className="absolute -top-24 -right-24 w-64 h-64 border-[12px] border-brand-primary/20 rounded-full"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 border-[12px] border-brand-secondary/20 rounded-full"></div>
            
            <div className="relative z-10 text-center mb-10">
              <h2 className="text-3xl font-heading font-bold text-white mb-4">Find The Perfect Specification</h2>
              <p className="text-brand-light/70 text-lg">Use our quick finder to locate products for your exact requirements.</p>
            </div>
            
            <div className="relative z-10 bg-white p-6 rounded-sm shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Category</label>
                  <select className="w-full border border-stone-300 rounded-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-brand-dark">
                    <option value="">All Categories</option>
                    {CATEGORIES_DATA.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Brand</label>
                  <select className="w-full border border-stone-300 rounded-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-brand-dark">
                    <option value="">All Brands</option>
                    {BRANDS_DATA.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div className="flex items-end">
                  <Link to="/products" className="w-full bg-brand-primary text-white px-6 py-3 rounded-sm font-semibold uppercase tracking-wider text-sm hover:bg-brand-secondary transition-colors text-center flex items-center justify-center gap-2 h-[46px]">
                    <SearchIcon size={18} /> Search Products
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Featured collections & 11. Featured products */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-brand-dark mb-4">Featured Collections</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto font-sans">
              Handpicked premium products that define contemporary luxury.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS_DATA.slice(0, 8).map((product) => (
              <div key={product.id} className="group bg-white border border-stone-200 hover:border-brand-primary/30 transition-all duration-300 flex flex-col h-full shadow-sm hover:shadow-md">
                <Link to={`/products/${product.sku}`} className="aspect-square bg-stone-100 relative overflow-hidden flex items-center justify-center p-6">
                  <OptimizedImage 
                    src={(product.images?.[0] || product.thumbnail || 'https://placehold.co/400')} 
                    alt={product.name} 
                    className="object-contain w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">{(BRANDS_DATA.find(b => b.id === product.brandId)?.name || 'Unknown Brand')}</div>
                  <Link to={`/products/${product.sku}`} className="font-heading font-bold text-lg text-brand-dark mb-2 group-hover:text-brand-primary transition-colors line-clamp-2">
                    {product.name}
                  </Link>
                  <div className="mt-auto pt-4 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-sm font-mono text-stone-500">{product.sku}</span>
                    <Link to={`/contact?tab=quote&sku=${product.sku}`} className="text-xs font-bold uppercase tracking-wider text-brand-primary hover:text-brand-secondary transition-colors">
                      Quote
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/products" className="inline-flex bg-transparent border border-brand-primary text-brand-primary px-8 py-3.5 rounded-sm font-semibold uppercase tracking-wider text-sm hover:bg-brand-primary hover:text-white transition-colors">
              View Entire Catalogue
            </Link>
          </div>
        </div>
      </section>

      {/* 8. International brands */}
      <section className="py-20 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-brand-dark mb-4">Our Premium Partner Brands</h2>
          <p className="text-stone-600 max-w-2xl mx-auto">We collaborate with world-renowned manufacturers to bring unparalleled quality to the UAE.</p>
        </div>
        <PartnerMarquee />
        <div className="mt-10 text-center">
          <Link to="/brands" className="text-sm font-bold text-brand-primary uppercase tracking-wider hover:text-brand-secondary transition-colors flex items-center justify-center gap-1">
            Explore All Brands <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* 9. Why choose AZM */}
      <section className="py-24 bg-brand-dark text-white relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">Why Choose AZM Group</h2>
              <p className="text-lg text-stone-400 mb-10 leading-relaxed">
                We are more than a supplier. We are your dedicated project partner, delivering premium building materials with exceptional service across the UAE.
              </p>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-sm bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold mb-2">Extensive Product Portfolio</h3>
                    <p className="text-stone-400">Curated collections of the finest sanitary ware, tiles, and slabs from Europe and beyond.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-sm bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold mb-2">Technical Expertise</h3>
                    <p className="text-stone-400">Our B2B consultants provide deep technical assistance to ensure accurate specifications for your projects.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-sm bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold mb-2">Responsive UAE Support</h3>
                    <p className="text-stone-400">Dedicated logistics and localized support ensuring your materials arrive on-site, on time.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/5] bg-stone-800 rounded-sm overflow-hidden relative">
                <OptimizedImage 
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop" 
                  alt="Modern commercial interior" 
                  className="object-cover w-full h-full opacity-80"
                />
              </div>
              {/* Floating stat card */}
              <div className="absolute -bottom-8 -left-8 bg-brand-secondary p-8 rounded-sm shadow-2xl max-w-xs">
                <div className="text-4xl font-heading font-bold text-white mb-2">20+</div>
                <div className="text-brand-light font-medium uppercase tracking-wide text-sm">Years of Excellence in UAE Projects</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Solutions by customer type */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-brand-dark mb-4">Tailored Industry Solutions</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto font-sans">
              We provide specialized procurement services adapted to the unique requirements of every stakeholder.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Architects', icon: <Layers size={32} />, desc: 'Access comprehensive BIM objects, CAD files, and technical specifications for seamless integration.' },
              { title: 'Interior Designers', icon: <Beaker size={32} />, desc: 'Curated mood boards, material swatches, and bespoke finish options for luxury spaces.' },
              { title: 'Contractors', icon: <Settings size={32} />, desc: 'Reliable supply chains, clear installation guides, and bulk procurement advantages.' },
              { title: 'Consultants', icon: <FileText size={32} />, desc: 'Compliance documentation, water-efficiency ratings, and robust warranty backing.' },
              { title: 'Developers', icon: <ShieldCheck size={32} />, desc: 'Scalable solutions combining aesthetic appeal with long-term durability and value.' },
              { title: 'Villa Owners', icon: <User size={32} />, desc: 'Personalized showroom consultations and guidance to create your dream home.' }
            ].map((solution, i) => (
              <div key={i} className="bg-white p-8 rounded-sm border border-stone-200 hover:border-brand-primary transition-colors group">
                <div className="w-16 h-16 bg-stone-50 group-hover:bg-brand-primary/10 rounded-full flex items-center justify-center text-stone-400 group-hover:text-brand-primary transition-colors mb-6">
                  {solution.icon}
                </div>
                <h3 className="text-xl font-heading font-bold text-brand-dark mb-3">{solution.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed mb-6">{solution.desc}</p>
                <Link to="/contact" className="text-sm font-bold text-brand-primary uppercase tracking-wider flex items-center gap-1 group-hover:text-brand-secondary transition-colors">
                  Contact Team <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. Animated business counters */}
      <section className="py-16 bg-brand-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-heading font-bold mb-2 text-brand-dark">50+</div>
              <div className="text-sm font-bold uppercase tracking-wider text-white/90">Premium Brands</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-heading font-bold mb-2 text-brand-dark">5,000+</div>
              <div className="text-sm font-bold uppercase tracking-wider text-white/90">Products Available</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-heading font-bold mb-2 text-brand-dark">1,000+</div>
              <div className="text-sm font-bold uppercase tracking-wider text-white/90">Projects Delivered</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-heading font-bold mb-2 text-brand-dark">100%</div>
              <div className="text-sm font-bold uppercase tracking-wider text-white/90">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* 13. Download-centre preview */}
      <section className="py-24 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="bg-brand-secondary rounded-xl overflow-hidden shadow-xl flex flex-col lg:flex-row">
              <div className="p-12 lg:p-20 lg:w-1/2 flex flex-col justify-center">
                 <div className="inline-block px-3 py-1 bg-brand-primary/20 text-brand-accent text-xs font-bold uppercase tracking-wider rounded-full mb-6 w-max">
                   Technical Resources
                 </div>
                 <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">Specify With Confidence</h2>
                 <p className="text-white/80 text-lg mb-10 leading-relaxed font-sans">
                   Access our comprehensive digital library containing product specifications, CAD drawings, flow rates, dimensions, and architectural catalogues.
                 </p>
                 <div className="flex flex-wrap gap-4">
                   <Link to="/catalogues" className="bg-brand-primary text-white px-6 py-3.5 rounded-sm font-semibold uppercase tracking-wider text-sm hover:bg-brand-dark transition-colors shadow-sm flex items-center gap-2">
                     <Download size={18} /> Access Download Centre
                   </Link>
                 </div>
              </div>
              <div className="lg:w-1/2 bg-brand-dark relative min-h-[400px]">
                 <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1628624747186-a941c476b7ef?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center"></div>
                 {/* Decorative catalogue mockups */}
                 <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="w-48 h-64 bg-white shadow-2xl rounded-sm rotate-[-5deg] transform transition-transform hover:rotate-0 hover:scale-105 duration-300 flex flex-col p-4 border border-stone-200">
                      <div className="flex-1 bg-stone-100 mb-4 flex items-center justify-center"><OptimizedImage src="https://placehold.co/200x300/e7e5e4/57534e?text=VADO" alt="Catalogue" className="w-full h-full object-cover mix-blend-multiply" /></div>
                      <div className="h-2 bg-stone-200 w-3/4 mb-2"></div>
                      <div className="h-2 bg-stone-200 w-1/2"></div>
                    </div>
                    <div className="w-48 h-64 bg-white shadow-2xl rounded-sm rotate-[10deg] transform translate-x-[-2rem] translate-y-[2rem] transition-transform hover:rotate-0 hover:scale-105 duration-300 flex flex-col p-4 border border-stone-200 z-10">
                      <div className="flex-1 bg-stone-100 mb-4 flex items-center justify-center"><OptimizedImage src="https://placehold.co/200x300/e7e5e4/57534e?text=Ceramics" alt="Catalogue" className="w-full h-full object-cover mix-blend-multiply" /></div>
                      <div className="h-2 bg-stone-200 w-3/4 mb-2"></div>
                      <div className="h-2 bg-stone-200 w-1/2"></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 14. Testimonials */}
      <TestimonialCarousel />

      {/* 15. Latest blog articles */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-brand-dark mb-4">Design Intelligence</h2>
              <p className="text-lg text-stone-600 font-sans">Industry trends, technical insights, and project showcases from across the UAE.</p>
            </div>
            <Link to="/blog" className="group flex items-center gap-2 text-sm font-bold text-brand-primary uppercase tracking-wider">
              View All Articles <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "The Rise of Architectural Brushed Brass in Hospitality", cat: "News", date: "June 2026", img: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1000&auto=format&fit=crop" },
              { title: "Specifying Large-Format Porcelain Slabs for Villa Facades", cat: "Technical", date: "May 2026", img: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1000&auto=format&fit=crop" },
              { title: "Water Efficiency Regulations: Navigating Dubai's Green Building Standards", cat: "Insights", date: "April 2026", img: "https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=1000&auto=format&fit=crop" }
            ].map((item, idx) => (
              <div key={idx} className="group cursor-pointer flex flex-col">
                <div className="aspect-[4/3] bg-stone-200 overflow-hidden relative mb-6 rounded-sm">
                  <OptimizedImage src={item.img} alt={item.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">{item.cat}</span>
                  <span className="text-xs text-stone-400">|</span>
                  <span className="text-xs font-medium text-stone-500">{item.date}</span>
                </div>
                <h3 className="text-xl font-heading font-bold text-brand-dark mb-3 group-hover:text-brand-primary transition-colors">{item.title}</h3>
                <Link to="/blog" className="mt-auto text-sm font-bold text-brand-primary uppercase tracking-wider flex items-center gap-1">
                  Read Article <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 16. Showroom visit CTA */}
      <section className="py-20 bg-stone-100 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-10 md:p-16 rounded-xl border border-stone-200 shadow-lg text-center max-w-4xl mx-auto">
            <MapPin className="text-brand-primary mx-auto mb-6" size={48} />
            <h2 className="text-3xl font-heading font-bold text-brand-dark mb-4">Experience the Quality in Person</h2>
            <p className="text-stone-600 text-lg mb-8 max-w-2xl mx-auto">
              Visit our Dubai showroom to interact with our extensive collection of sanitary ware, mixers, and architectural surfaces. Our consultants are ready to assist with your project BOQ.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/contact" className="bg-brand-primary text-white px-8 py-4 rounded-sm font-semibold uppercase tracking-wider text-sm hover:bg-brand-dark transition-colors shadow-sm">
                Get Directions
              </Link>
              <a href="tel:+97142844452" className="bg-transparent border border-stone-300 text-stone-700 px-8 py-4 rounded-sm font-semibold uppercase tracking-wider text-sm hover:bg-stone-50 transition-colors flex items-center justify-center gap-2">
                <Phone size={18} /> Call Showroom
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 17. FAQ section */}
      <section className="py-24 bg-white border-t border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-brand-dark mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-stone-600 font-sans">Common inquiries from our B2B partners and clients.</p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border border-stone-200 rounded-sm overflow-hidden"
              >
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 flex items-center justify-between bg-stone-50 hover:bg-stone-100 transition-colors focus:outline-none"
                >
                  <span className="font-heading font-bold text-left text-brand-dark text-lg">{faq.question}</span>
                  {activeFaq === index ? (
                    <Minus className="text-brand-primary flex-shrink-0" size={20} />
                  ) : (
                    <Plus className="text-stone-400 flex-shrink-0" size={20} />
                  )}
                </button>
                
                <AnimatePresence>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 py-5 bg-white text-stone-600 border-t border-stone-100 leading-relaxed font-sans">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 18. Final quotation CTA */}
      <section className="py-32 bg-brand-dark text-white relative overflow-hidden border-t-4 border-brand-accent">
         <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-secondary/10 blur-[100px] pointer-events-none transform translate-x-1/2"></div>
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tight mb-6">Ready to Supply Your Next Project?</h2>
            <p className="text-xl text-brand-light/70 mb-12 font-sans max-w-2xl mx-auto leading-relaxed">
              Connect with our dedicated B2B specialists to discuss bespoke quotations, technical specifications, and procurement schedules.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/contact?tab=quote" className="w-full sm:w-auto bg-brand-primary text-white px-10 py-4.5 rounded-sm font-semibold uppercase tracking-wider text-sm hover:bg-brand-secondary transition-colors shadow-sm flex items-center justify-center gap-2">
                <Mail size={18} /> Request Formal Quotation
              </Link>
              <a href="https://wa.me/971558090292" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-transparent border border-stone-500 text-white px-10 py-4.5 rounded-sm font-semibold uppercase tracking-wider text-sm hover:bg-white hover:text-brand-dark hover:border-white transition-colors flex items-center justify-center gap-2">
                 WhatsApp Sales Team
              </a>
            </div>
         </div>
      </section>
    </div>
  );
}
