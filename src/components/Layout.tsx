import { Link, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  ChevronDown,
  MessageCircle,
  Mail,
  MapPin,
  Phone,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CATEGORIES_DATA } from "../data";
import { PredictiveSearch } from "./PredictiveSearch";
import { AnalyticsManager } from "./AnalyticsManager";
import { InquiryModal } from "./InquiryModal";
import { InquiryWidget } from "./InquiryWidget";
import { FloatingContact } from "./FloatingContact";

export function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveMegaMenu(null);
  }, [location.pathname]);

  const navigation = [
    { name: "About Us", path: "/about" },
    { 
      name: "Categories", 
      path: "/categories",
    },
    { 
      name: "Products", 
      path: "/products",
      megaMenu: "products"
    },
    { 
      name: "Brands", 
      path: "/brands",
      megaMenu: "brands"
    },
    { name: "Catalogues", path: "/catalogues" },
    { name: "News", path: "/blog" },
    { name: "Showrooms", path: "/contact" },
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans text-brand-dark">
      <AnalyticsManager />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-white focus:text-brand-dark">
        Skip to main content
      </a>
      {/* Top Bar for B2B Fast Actions */}
      <div className="bg-brand-secondary text-white py-2 text-xs md:text-sm font-medium tracking-wide">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <a href="tel:+97142844452" className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone size={14} /> Call Us: +971 4 28 444 52
            </a>
            <a href="https://wa.me/971558090292" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
              <MessageCircle size={14} /> WhatsApp: +971 55 8090 292
            </a>
            <a href="mailto:sales@alzahrabm.com" className="hidden sm:flex items-center gap-2 hover:text-white transition-colors">
              <Mail size={14} /> sales@alzahrabm.com
            </a>
            <span className="hidden lg:flex items-center gap-2">
              Working Hours: Mon - Sun | 9:00 AM - 9:00 PM
            </span>
          </div>
          
        </div>
      </div>

      {/* Main Navigation */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200 group" onMouseLeave={() => setActiveMegaMenu(null)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-brand-primary text-white flex items-center justify-center font-bold text-xl tracking-tighter">
                  AZM
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xl leading-none tracking-tight text-brand-secondary">GROUP</span>
                  <span className="text-[0.65rem] uppercase tracking-widest text-[#35adb8] font-medium">UAE</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-6 xl:space-x-8 items-center">
              {navigation.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setActiveMegaMenu(item.megaMenu || null)}
                >
                  <Link
                    to={item.path}
                    className={`flex items-center gap-1 py-8 text-sm font-semibold tracking-wide uppercase transition-colors ${
                      location.pathname.startsWith(item.path) && item.path !== '/' ? "text-stone-900" : "text-stone-500 hover:text-stone-900"
                    }`}
                  >
                    {item.name}
                    {item.megaMenu && <ChevronDown size={14} className={`transition-transform duration-300 ${activeMegaMenu === item.megaMenu ? 'rotate-180 text-brand-primary' : ''}`} />}
                  </Link>
                </div>
              ))}
              
              <div className="w-56 mt-[-4px]">
                 <PredictiveSearch variant="light" />
              </div>
              
              <Link
                to="/contact"
                className="bg-brand-secondary text-white px-5 py-2.5 text-sm font-semibold uppercase tracking-wider hover:bg-brand-primary transition-colors"
              >
                Inquire Now
              </Link>
            </nav>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-stone-900 p-2"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mega Menus Container */}
        <AnimatePresence>
          {activeMegaMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-full left-0 w-full bg-white border-b border-stone-200 shadow-2xl overflow-hidden"
              onMouseEnter={() => setActiveMegaMenu(activeMegaMenu)}
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {activeMegaMenu === 'products' && (
                  <div className="grid grid-cols-4 gap-8">
                    <div className="col-span-1">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-6">By Category</h3>
                      <ul className="space-y-4">
                        {CATEGORIES_DATA.map(cat => (
                          <li key={cat.id}>
                            <Link to={`/products?category=${cat.id}`} className="text-stone-600 hover:text-brand-primary transition-colors font-medium">
                              {cat.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="col-span-1">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-6">Collections</h3>
                      <ul className="space-y-4">
                        <li><Link to="/products" className="text-stone-600 hover:text-brand-primary transition-colors font-medium">Modern Minimalist</Link></li>
                        <li><Link to="/products" className="text-stone-600 hover:text-brand-primary transition-colors font-medium">Classic Elegance</Link></li>
                        <li><Link to="/products" className="text-stone-600 hover:text-brand-primary transition-colors font-medium">Industrial Chic</Link></li>
                        <li><Link to="/products" className="text-stone-600 hover:text-brand-primary transition-colors font-medium">Sustainable Luxury</Link></li>
                      </ul>
                    </div>
                    <div className="col-span-2 relative group overflow-hidden bg-stone-100 p-8 flex flex-col justify-end min-h-[300px] rounded-xl">
                      <img src="https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=800&auto=format&fit=crop" alt="Featured Collection" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700" />
                      <div className="relative z-10">
                        <span className="bg-white text-brand-secondary px-3 py-1 text-xs font-bold uppercase tracking-wider mb-3 inline-block">New Arrival</span>
                        <h4 className="text-2xl font-bold font-display text-brand-secondary mb-2">The VADO Knurled Collection</h4>
                        <Link to="/vado-collection" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-brand-secondary hover:text-brand-primary transition-colors">
                          Explore Now &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {activeMegaMenu === 'brands' && (
                  <div className="grid grid-cols-4 gap-8">
                     <div className="col-span-2">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-6">Our Premium Partners</h3>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        <Link to="/brands/vado" className="text-stone-600 hover:text-brand-primary transition-colors font-medium text-lg">VADO UK</Link>
                        <Link to="/brands/jaquar" className="text-stone-600 hover:text-brand-primary transition-colors font-medium text-lg">JAQUAR</Link>
                        <Link to="/brands/italian-standards" className="text-stone-600 hover:text-brand-primary transition-colors font-medium text-lg">ITALIAN STANDARDS</Link>
                        <Link to="/brands/nourk" className="text-stone-600 hover:text-brand-primary transition-colors font-medium text-lg">NOURK</Link>
                        <Link to="/brands/sanit" className="text-stone-600 hover:text-brand-primary transition-colors font-medium text-lg">SANIT</Link>
                        <Link to="/brands/sonet" className="text-stone-600 hover:text-brand-primary transition-colors font-medium text-lg">SONET</Link>
                      </div>
                    </div>
                    <div className="col-span-2 relative group overflow-hidden bg-brand-secondary p-8 flex flex-col justify-end min-h-[300px] rounded-xl">
                      <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop" alt="VADO UK" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" />
                      <div className="relative z-10">
                        <h4 className="text-3xl font-bold font-display text-white mb-2">VADO UK</h4>
                        <p className="text-white/80 mb-4 max-w-sm">Exquisite British brassware engineering combining luxury design with water-saving technology.</p>
                        <Link to="/brands" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white hover:text-brand-primary transition-colors">
                          Discover VADO &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-b border-stone-200 overflow-hidden"
            >
              <div className="px-4 py-4 border-b border-stone-100">
                <PredictiveSearch variant="light" />
              </div>
              <div className="px-4 pt-2 pb-6 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-3 text-base font-semibold tracking-wide uppercase text-stone-800 border-b border-stone-100"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-grow flex flex-col">
        <Outlet />
      </main>

      <FloatingContact />
      <InquiryWidget />
      {/* Floating Action Buttons for Lead Gen */}
      

      {/* Footer */}
      <footer className="bg-brand-secondary text-brand-light/80 py-16 lg:py-24 border-t border-brand-secondary/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-brand-primary text-white flex items-center justify-center font-bold text-xl tracking-tighter shadow-lg">
                AZM
              </div>
              <div className="flex flex-col text-white">
                <span className="font-bold text-xl leading-none tracking-tight">GROUP</span>
                <span className="text-[0.65rem] uppercase tracking-widest text-brand-primary font-medium">UAE</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Premium Sanitary Ware, Bathroom Solutions, Kitchen Solutions, and Building Materials for distinguished B2B and retail projects across the UAE.
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <span className="flex items-start gap-2"><MapPin size={16} className="text-brand-primary mt-1" /> <span>Shop 12<br/>Building Materials Mall<br/>Warsan-3, Dubai<br/>United Arab Emirates</span></span>
              <span className="flex items-center gap-2"><Phone size={16} className="text-brand-primary" /> +971 4 28 444 52</span>
              <span className="flex items-center gap-2"><MessageCircle size={16} className="text-brand-primary" /> +971 55 8090 292</span>
              <span className="flex items-center gap-2"><Mail size={16} className="text-brand-primary" /> sales@alzahrabm.com</span>
              <span className="flex items-center gap-2 text-xs mt-2 text-white/60">Business Hours: Mon - Sun | 9:00 AM - 9:00 PM</span>
              <a href="https://www.google.com/maps?q=25.161985,55.461234" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-700 text-white px-4 py-2 mt-4 text-xs font-bold uppercase tracking-wider rounded transition-colors w-fit"><MapPin size={14} /> View on Google Maps</a>
            </div>
          </div>

          <div>
             <h4 className="text-white font-semibold uppercase tracking-wider mb-6">Quick Links</h4>
             <ul className="space-y-3 text-sm">
               <li><Link to="/about" className="hover:text-white transition-colors">Corporate Profile</Link></li>
               <li><Link to="/vado-collection" className="hover:text-white transition-colors">VADO UK Collection</Link></li>
               <li><Link to="/catalogues" className="hover:text-white transition-colors">Download Catalogues</Link></li>
               <li><Link to="/contact" className="hover:text-white transition-colors">Showroom Locator</Link></li>
               <li><Link to="/style-guide" className="hover:text-brand-primary text-brand-primary font-semibold transition-colors">UI Style Guide</Link></li>
             </ul>
          </div>

          <div>
             <h4 className="text-white font-semibold uppercase tracking-wider mb-6">Product Categories</h4>
             <ul className="space-y-3 text-sm">
               <li><Link to="/products/bathroom-faucets" className="hover:text-white transition-colors">Bathroom Faucets</Link></li>
               <li><Link to="/products/shower-systems" className="hover:text-white transition-colors">Shower Systems</Link></li>
               <li><Link to="/products/wash-basins" className="hover:text-white transition-colors">Wash Basins</Link></li>
               <li><Link to="/products/tiles" className="hover:text-white transition-colors">Tiles & Slabs</Link></li>
               <li><Link to="/products" className="hover:text-white transition-colors italic">View all products &rarr;</Link></li>
             </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider mb-6">Trade Newsletter</h4>
            <p className="text-sm mb-4">Subscribe for the latest VADO UK arrivals and exclusive B2B trade offers.</p>
             <form className="flex" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="bg-stone-900 border border-stone-800 px-4 py-2 text-sm text-white focus:outline-none focus:border-stone-500 w-full"
                />
                <button type="submit" className="bg-white text-stone-900 px-4 py-2 text-sm font-semibold hover:bg-stone-200 transition-colors">
                  JOIN
                </button>
             </form>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-white/10 text-xs flex flex-col md:flex-row justify-between items-center text-white/60">
          <p>&copy; {new Date().getFullYear()} Al Zahra Al Malakia Bldg. Mat. Tr. LLC. All Rights Reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/admin" className="hover:text-brand-primary transition-colors font-semibold text-white/80">Admin Portal</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
              </div>
      </footer>
      <InquiryModal isOpen={isInquiryModalOpen} onClose={() => setIsInquiryModalOpen(false)} />
    </div>
  );
}
