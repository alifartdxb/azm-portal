import React, { useState } from 'react';
import { Search, Filter, X, ChevronRight, Check, AlertCircle, Info, UploadCloud } from 'lucide-react';
import { Link } from 'react-router-dom';

export function StyleGuide() {
  const [modalOpen, setModalOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8 font-sans" dir="ltr">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="border-b border-stone-200 pb-8">
          <h1 className="text-4xl font-heading font-bold text-brand-dark mb-4">AZM Group UI Style Guide</h1>
          <p className="text-lg text-stone-600">A premium, modern corporate design system inspired by Apple's visual simplicity and European luxury brands.</p>
        </div>

        {/* 1. Colors */}
        <section>
          <h2 className="text-2xl font-heading font-bold text-brand-dark mb-6 border-b border-stone-100 pb-2">1. Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <ColorSwatch bg="bg-brand-primary" name="Primary" hex="#0f466b" />
            <ColorSwatch bg="bg-brand-secondary" name="Secondary" hex="#319ba4" />
            <ColorSwatch bg="bg-brand-accent" name="Accent (Champagne)" hex="#c5a059" />
            <ColorSwatch bg="bg-brand-dark" name="Dark (Navy-Charcoal)" hex="#1e293b" />
            <ColorSwatch bg="bg-brand-light" name="Light (Warm White)" hex="#f8fafc" border />
            <ColorSwatch bg="bg-white" name="White" hex="#ffffff" border />
          </div>
        </section>

        {/* 2. Typography */}
        <section>
          <h2 className="text-2xl font-heading font-bold text-brand-dark mb-6 border-b border-stone-100 pb-2">2. Typography</h2>
          <div className="space-y-6 bg-white p-8 rounded-xl border border-stone-200">
            <div>
              <p className="text-sm text-stone-500 mb-1 font-sans uppercase tracking-wider">Heading 1 - DM Sans</p>
              <h1 className="text-5xl font-heading font-bold text-brand-dark">Premium Bathroom Solutions</h1>
            </div>
            <div>
              <p className="text-sm text-stone-500 mb-1 font-sans uppercase tracking-wider">Heading 2 - DM Sans</p>
              <h2 className="text-4xl font-heading font-bold text-brand-dark">Luxury Sanitary Ware</h2>
            </div>
            <div>
              <p className="text-sm text-stone-500 mb-1 font-sans uppercase tracking-wider">Heading 3 - DM Sans</p>
              <h3 className="text-3xl font-heading font-bold text-brand-dark">Our Collections</h3>
            </div>
            <div>
              <p className="text-sm text-stone-500 mb-1 font-sans uppercase tracking-wider">Heading 4 - DM Sans</p>
              <h4 className="text-xl font-heading font-bold text-brand-dark">VADO Individual</h4>
            </div>
            <div>
              <p className="text-sm text-stone-500 mb-1 font-sans uppercase tracking-wider">Body - Inter</p>
              <p className="text-base text-stone-600 font-sans leading-relaxed max-w-3xl">
                The luxury bathroom industry is undergoing a profound transformation. As environmental consciousness grows among developers, architects, and homeowners in the UAE, the demand for sustainable yet luxurious sanitary ware has never been higher.
              </p>
            </div>
            <div>
              <p className="text-sm text-stone-500 mb-1 font-sans uppercase tracking-wider">Arabic Body - Noto Sans Arabic (dir="rtl")</p>
              <p className="text-base text-stone-600 font-sans leading-relaxed max-w-3xl" dir="rtl">
                صناعة الحمامات الفاخرة تشهد تحولاً عميقاً. مع تزايد الوعي البيئي بين المطورين والمهندسين المعماريين وأصحاب المنازل في دولة الإمارات العربية المتحدة.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Buttons */}
        <section>
          <h2 className="text-2xl font-heading font-bold text-brand-dark mb-6 border-b border-stone-100 pb-2">3. Buttons</h2>
          <div className="flex flex-wrap items-center gap-6 bg-white p-8 rounded-xl border border-stone-200">
            <button className="bg-brand-primary text-white px-8 py-3.5 rounded-sm font-semibold uppercase tracking-wider text-sm hover:bg-brand-dark transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2">
              Primary Button
            </button>
            <button className="bg-brand-secondary text-white px-8 py-3.5 rounded-sm font-semibold uppercase tracking-wider text-sm hover:bg-brand-primary transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:ring-offset-2">
              Secondary Button
            </button>
            <button className="bg-transparent border border-brand-primary text-brand-primary px-8 py-3.5 rounded-sm font-semibold uppercase tracking-wider text-sm hover:bg-brand-primary hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2">
              Outline Button
            </button>
            <button className="bg-[#25D366] text-white px-8 py-3.5 rounded-sm font-semibold uppercase tracking-wider text-sm hover:bg-[#1DA851] transition-colors shadow-sm flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              WhatsApp Us
            </button>
            <button className="bg-brand-light text-brand-dark px-8 py-3.5 rounded-sm font-semibold uppercase tracking-wider text-sm hover:bg-stone-200 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-200 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
              Disabled Button
            </button>
          </div>
        </section>

        {/* 4. Inputs & Forms */}
        <section>
          <h2 className="text-2xl font-heading font-bold text-brand-dark mb-6 border-b border-stone-100 pb-2">4. Form Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-xl border border-stone-200">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-2">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Enter your name" 
                  className="w-full border border-stone-300 rounded-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-colors bg-white text-stone-900 placeholder:text-stone-400"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-2">Category</label>
                <div className="relative">
                  <select className="w-full border border-stone-300 rounded-sm px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary bg-white text-stone-900">
                    <option>Select Category</option>
                    <option>Sanitary Ware</option>
                    <option>Tiles & Slabs</option>
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 rotate-90 pointer-events-none" size={16} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-2">Error State</label>
                <input 
                  type="text" 
                  defaultValue="Invalid input" 
                  className="w-full border border-red-500 rounded-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-colors bg-red-50 text-stone-900"
                />
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle size={12} /> This field is required.</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-2">Search</label>
                <div className="relative">
                  <input 
                    type="search" 
                    placeholder="Search products..." 
                    className="w-full border border-stone-300 rounded-full px-5 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-colors bg-stone-50"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-2">File Upload</label>
                <div className="border-2 border-dashed border-stone-300 rounded-lg p-6 flex flex-col items-center justify-center bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-brand-primary/50 focus-within:border-brand-primary">
                  <UploadCloud className="text-stone-400 mb-2" size={24} />
                  <p className="text-sm font-semibold text-brand-primary">Click to upload <span className="text-stone-500 font-normal">or drag and drop</span></p>
                  <p className="text-xs text-stone-400 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                  <input type="file" className="sr-only" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Cards */}
        <section>
          <h2 className="text-2xl font-heading font-bold text-brand-dark mb-6 border-b border-stone-100 pb-2">5. Cards & Modules</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Product Card */}
            <div>
              <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-4">Product Card</h3>
              <div className="group bg-white border border-stone-200 hover:border-brand-primary/30 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md">
                <div className="aspect-square bg-stone-100 relative overflow-hidden flex items-center justify-center p-6">
                  <div className="absolute top-4 left-4 z-10 flex gap-2">
                    <span className="bg-white/90 backdrop-blur text-brand-dark text-xs font-bold px-3 py-1 uppercase tracking-wider">New</span>
                  </div>
                  <img src="https://placehold.co/400x400/f5f5f4/57534e?text=Product+Image" alt="Product" className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="text-xs font-bold text-brand-secondary uppercase tracking-wider mb-2">VADO</div>
                  <h4 className="font-heading font-bold text-lg text-brand-dark mb-2 group-hover:text-brand-primary transition-colors line-clamp-2">Individual Basin Mixer</h4>
                  <div className="mt-auto pt-4 border-t border-stone-100 text-sm text-stone-500 flex items-center justify-between">
                    <span>Brushed Gold</span>
                    <span className="text-brand-primary group-hover:translate-x-1 transition-transform"><ChevronRight size={16} /></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Brand Card */}
            <div>
              <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-4">Brand Card</h3>
              <div className="group bg-white border border-stone-200 hover:border-brand-primary/30 transition-all p-8 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md h-full cursor-pointer">
                <img src="https://placehold.co/200x100/ffffff/57534e?text=BRAND+LOGO" alt="Brand Logo" className="h-12 object-contain opacity-70 group-hover:opacity-100 transition-opacity mb-6 grayscale group-hover:grayscale-0" />
                <h4 className="font-heading font-bold text-xl text-brand-dark mb-2">VADO UK</h4>
                <p className="text-sm text-stone-500">Premium brassware & showers.</p>
              </div>
            </div>

            {/* Project/Blog Card */}
            <div>
              <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-4">Blog / Project Card</h3>
              <div className="group flex flex-col cursor-pointer">
                <div className="aspect-[4/3] bg-stone-200 overflow-hidden relative">
                  <img src="https://placehold.co/600x450/e7e5e4/57534e?text=Project+Photo" alt="Project" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-transparent transition-colors"></div>
                </div>
                <div className="pt-6">
                  <div className="text-xs font-bold text-brand-accent uppercase tracking-wider mb-3">Project Case Study</div>
                  <h4 className="font-heading font-bold text-2xl text-brand-dark mb-3 group-hover:text-brand-primary transition-colors leading-tight">Luxury Villa Palm Jumeirah</h4>
                  <p className="text-stone-600 line-clamp-2">Complete bathroom fit-out using premium Italian ceramics and British brassware.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Navigation & Status */}
        <section>
          <h2 className="text-2xl font-heading font-bold text-brand-dark mb-6 border-b border-stone-100 pb-2">6. Navigation & Status</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8 bg-white p-8 rounded-xl border border-stone-200">
              
              {/* Breadcrumbs */}
              <div>
                <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-4">Breadcrumb</h3>
                <nav className="flex items-center text-sm font-medium text-stone-500 space-x-2">
                  <Link to="#" className="hover:text-brand-primary transition-colors">Home</Link>
                  <ChevronRight size={14} className="text-stone-300" />
                  <Link to="#" className="hover:text-brand-primary transition-colors">Products</Link>
                  <ChevronRight size={14} className="text-stone-300" />
                  <span className="text-brand-dark">Bathroom Faucets</span>
                </nav>
              </div>

              {/* Badges */}
              <div>
                <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-4">Badges</h3>
                <div className="flex flex-wrap gap-3">
                  <span className="bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider">Active</span>
                  <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider">Pending</span>
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider">Error</span>
                  <span className="bg-stone-100 text-stone-600 px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider border border-stone-200">Draft</span>
                </div>
              </div>

              {/* Pagination */}
              <div>
                <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-4">Pagination</h3>
                <div className="flex items-center gap-1">
                  <button className="w-10 h-10 flex items-center justify-center border border-stone-200 text-stone-500 hover:bg-stone-50 transition-colors disabled:opacity-50" disabled>
                    <ChevronRight size={16} className="rotate-180" />
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center border border-brand-primary bg-brand-primary text-white font-bold transition-colors">1</button>
                  <button className="w-10 h-10 flex items-center justify-center border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors">2</button>
                  <button className="w-10 h-10 flex items-center justify-center border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors">3</button>
                  <span className="w-10 h-10 flex items-center justify-center text-stone-400">...</span>
                  <button className="w-10 h-10 flex items-center justify-center border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors">10</button>
                  <button className="w-10 h-10 flex items-center justify-center border border-stone-200 text-stone-500 hover:bg-stone-50 transition-colors">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-8 bg-white p-8 rounded-xl border border-stone-200">
              
              {/* Filter Panel / Accordion */}
              <div>
                <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-4">Accordion / Filter Panel</h3>
                <div className="border border-stone-200 rounded-sm">
                  <div className="px-4 py-3 bg-stone-50 border-b border-stone-200 flex justify-between items-center cursor-pointer">
                    <span className="font-bold text-brand-dark">Filter by Category</span>
                    <ChevronRight size={16} className="rotate-90 text-stone-500" />
                  </div>
                  <div className="p-4 space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-5 h-5 border border-stone-300 rounded-sm flex items-center justify-center group-hover:border-brand-primary bg-brand-primary text-white transition-colors">
                        <Check size={14} />
                      </div>
                      <span className="text-stone-700">Sanitary Ware</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-5 h-5 border border-stone-300 rounded-sm flex items-center justify-center group-hover:border-brand-primary transition-colors">
                      </div>
                      <span className="text-stone-700">Tiles & Slabs</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Alerts & Toasts */}
              <div>
                <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-4">Alerts</h3>
                <div className="bg-blue-50 border border-blue-200 p-4 flex gap-3 items-start">
                  <Info className="text-blue-500 mt-0.5 flex-shrink-0" size={18} />
                  <div>
                    <h4 className="font-bold text-blue-900 text-sm">Information Update</h4>
                    <p className="text-blue-700 text-sm mt-1">This product is currently out of stock but can be pre-ordered.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 7. Loading & Empty States */}
        <section>
          <h2 className="text-2xl font-heading font-bold text-brand-dark mb-6 border-b border-stone-100 pb-2">7. Loading & Empty States</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Loading Skeleton */}
            <div className="bg-white p-8 rounded-xl border border-stone-200">
              <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-6">Skeleton Loader</h3>
              <div className="animate-pulse space-y-6">
                <div className="w-full aspect-[4/3] bg-stone-200"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-stone-200 w-1/4"></div>
                  <div className="h-6 bg-stone-200 w-3/4"></div>
                  <div className="h-4 bg-stone-200 w-full"></div>
                  <div className="h-4 bg-stone-200 w-5/6"></div>
                </div>
              </div>
            </div>

            {/* Empty State */}
            <div className="bg-white p-8 rounded-xl border border-stone-200 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 mb-4">
                <Search size={24} />
              </div>
              <h3 className="font-heading font-bold text-xl text-brand-dark mb-2">No products found</h3>
              <p className="text-stone-500 mb-6 max-w-sm">We couldn't find any products matching your current filters. Try adjusting your search criteria.</p>
              <button className="bg-transparent border border-stone-300 text-stone-700 px-6 py-2 rounded-sm font-semibold uppercase tracking-wider text-sm hover:bg-stone-50 transition-colors">
                Clear Filters
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

function ColorSwatch({ bg, name, hex, border = false }: { bg: string, name: string, hex: string, border?: boolean }) {
  return (
    <div className="flex flex-col">
      <div className={`h-24 w-full ${bg} ${border ? 'border border-stone-200' : ''} shadow-sm rounded-t-lg`}></div>
      <div className="bg-white border border-t-0 border-stone-200 p-4 rounded-b-lg flex flex-col">
        <span className="font-bold text-sm text-brand-dark truncate">{name}</span>
        <span className="text-xs font-mono text-stone-500 mt-1 uppercase">{hex}</span>
      </div>
    </div>
  );
}
