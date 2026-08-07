import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { SEO } from '../components/SEO';
import { OptimizedImage } from '../components/OptimizedImage';
import { 
  Building2, Target, Eye, Shield, Diamond, Lightbulb, 
  HeartHandshake, BadgeCheck, Clock, Recycle, 
  MessageSquare, ChevronDown, ArrowRight, MapPin, 
  PhoneCall, CheckCircle2, Factory, HardHat, Building,
  ThumbsUp, Users, Box, Headphones, Truck, Quote
} from 'lucide-react';

export function About() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "AZM Group",
      "url": "https://www.alzahrabm.com",
      "logo": "https://www.alzahrabm.com/logo.png",
      "description": "Leading supplier of premium bathroom and kitchen solutions in the UAE.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Dubai",
        "addressCountry": "AE"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.alzahrabm.com/" },
        { "@type": "ListItem", "position": 2, "name": "About Us", "item": "https://www.alzahrabm.com/about" }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Why choose AZM Group?",
          "acceptedAnswer": { "@type": "Answer", "text": "AZM Group offers a curated portfolio of premium international brands, expert consultation, fast project support, and competitive pricing for luxury building materials." }
        },
        {
          "@type": "Question",
          "name": "Do you supply VADO products in UAE?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes, we are a proud supplier of VADO UK collections, offering their full range of exquisite British brassware and bathroom solutions across the UAE." }
        },
        {
          "@type": "Question",
          "name": "Can contractors request quotations?",
          "acceptedAnswer": { "@type": "Answer", "text": "Absolutely. We provide dedicated support and competitive B2B pricing for contractors, developers, and architects on residential and commercial projects." }
        },
        {
          "@type": "Question",
          "name": "Do you support commercial projects?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes, our experienced team supports large-scale commercial projects, hotels, healthcare facilities, and mixed-use developments with tailored solutions." }
        },
        {
          "@type": "Question",
          "name": "Do you deliver across UAE?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes, we provide reliable, UAE-wide delivery through our robust supply chain network, ensuring your materials arrive safely and on time." }
        }
      ]
    }
  ];

  return (
    <div className="flex-grow flex flex-col bg-white overflow-hidden">
      <SEO 
        title="About Us | Luxury Bathroom Solutions Dubai | AZM Group"
        description="Discover AZM Group, the leading supplier of premium bathroom, kitchen solutions, and building materials in the UAE. Partnering with elite brands like VADO."
        keywords={["Bathroom Solutions Dubai", "Luxury Bathroom Supplier UAE", "Sanitary Ware Supplier Dubai", "Kitchen Solutions UAE", "Bathroom Accessories Dubai", "VADO UAE", "Premium Bathroom Fittings Dubai", "Building Materials Supplier Dubai", "Bathroom Showroom Dubai", "Bathroom Mixers UAE"]}
        schemas={schemas}
      />

      {/* SECTION 1: Luxury Hero Banner */}
      <section className="relative min-h-[90vh] flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <OptimizedImage 
            src="https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=2000&auto=format&fit=crop" 
            alt="Luxury Bathroom Design"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 via-stone-900/70 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-brand-primary/20 text-brand-primary font-bold text-xs uppercase tracking-widest mb-6 backdrop-blur-md border border-brand-primary/30">
              Est. 2010 • Dubai, UAE
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display text-white leading-tight mb-6">
              Building Exceptional Spaces with Premium Solutions
            </h1>
            <p className="text-lg md:text-xl text-stone-200 leading-relaxed mb-10 max-w-2xl font-light">
              Delivering world-class sanitary ware, luxury bathroom fittings, premium kitchen solutions, and building materials across the UAE with quality, innovation, and trusted global brands.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact" className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-brand-secondary transition-all hover:shadow-lg hover:-translate-y-1">
                Request a Quote <ArrowRight size={18} />
              </Link>
              <Link to="/contact?tab=showroom" className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-white hover:text-brand-secondary transition-all hover:shadow-lg hover:-translate-y-1">
                Visit Our Showroom <MapPin size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: Our Story */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-4">Our Heritage</h2>
              <h3 className="text-3xl md:text-5xl font-bold font-display text-brand-secondary mb-6 leading-tight">
                A Legacy of Excellence in Building Materials
              </h3>
              <div className="prose prose-stone prose-lg text-stone-600">
                <p>
                  AZM Group was established with a singular vision: to elevate the standard of living spaces across the United Arab Emirates by providing uncompromising quality in building materials and luxury sanitary solutions.
                </p>
                <p>
                  Over the years, our passion for excellence and our commitment to customer satisfaction have solidified our position as a trusted partner for the region's most ambitious architectural projects. We don't just supply products; we curate experiences.
                </p>
                <p>
                  By focusing on premium international brands and fostering long-term relationships with both our manufacturing partners and our discerning clientele, AZM Group continues to shape the future of luxury interiors in Dubai and beyond.
                </p>
              </div>
              <div className="mt-10">
                <Link to="/contact" className="inline-flex items-center gap-2 text-brand-secondary font-bold uppercase tracking-wider hover:text-brand-primary transition-colors pb-1 border-b-2 border-brand-primary">
                  Speak to our experts <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-2xl overflow-hidden relative z-10 shadow-2xl">
                <OptimizedImage 
                  src="https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=1200&auto=format&fit=crop" 
                  alt="AZM Group History"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-stone-100 rounded-2xl z-0 border border-stone-200" />
              <div className="absolute top-1/2 -right-8 -translate-y-1/2 bg-white p-6 rounded-2xl shadow-xl z-20 border border-stone-100 max-w-xs">
                <div className="flex gap-1 text-brand-primary mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="fill-current w-5 h-5" />)}
                </div>
                <p className="text-sm font-bold text-stone-800 mb-1">"The gold standard for luxury sanitary ware in Dubai."</p>
                <p className="text-xs text-stone-500 uppercase tracking-wider">Lead Architect, Premium Villas</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 3 & 4: Mission and Vision (Dark Section) */}
      <section className="py-24 bg-brand-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 p-10 rounded-3xl backdrop-blur-sm hover:bg-white/10 transition-colors duration-500"
            >
              <Target className="w-12 h-12 text-brand-primary mb-8" />
              <h3 className="text-3xl font-bold font-display mb-6">Our Mission</h3>
              <p className="text-stone-300 text-lg leading-relaxed mb-8">
                To empower architects, developers, and homeowners with a customer-first approach, delivering quality products and innovative solutions. We are dedicated to providing professional service that fosters long-term partnerships and turns visionary designs into reality.
              </p>
              <ul className="space-y-4">
                {['Customer-First Approach', 'Uncompromising Quality', 'Continuous Innovation', 'Professional Partnerships'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-stone-200">
                    <CheckCircle2 className="w-5 h-5 text-brand-primary" /> {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-brand-primary/10 border border-brand-primary/20 p-10 rounded-3xl backdrop-blur-sm hover:bg-brand-primary/20 transition-colors duration-500"
            >
              <Eye className="w-12 h-12 text-brand-primary mb-8" />
              <h3 className="text-3xl font-bold font-display mb-6">Our Vision</h3>
              <p className="text-stone-300 text-lg leading-relaxed mb-8">
                To be universally recognized as the leading supplier and trusted project partner for luxury bathroom and building solutions in the UAE. We strive to be the definitive innovation leader, setting the benchmark for aesthetic excellence and functional superiority.
              </p>
              <ul className="space-y-4">
                {['Leading Supplier in UAE', 'Trusted Project Partner', 'Luxury Bathroom Specialist', 'Innovation Leader'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-stone-200">
                    <CheckCircle2 className="w-5 h-5 text-brand-primary" /> {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 5: Core Values */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-4">Our Principles</h2>
            <h3 className="text-3xl md:text-5xl font-bold font-display text-brand-secondary mb-6">Core Values</h3>
            <p className="text-stone-600 text-lg">The foundational beliefs that guide our operations, shape our culture, and drive our commitment to excellence.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Integrity', desc: 'Honesty and strong moral principles in all dealings.' },
              { icon: Diamond, title: 'Quality', desc: 'Sourcing only the finest materials globally.' },
              { icon: Lightbulb, title: 'Innovation', desc: 'Embracing modern technology and design.' },
              { icon: HeartHandshake, title: 'Customer Commitment', desc: 'Dedicated to exceeding expectations.' },
              { icon: BadgeCheck, title: 'Professional Excellence', desc: 'Maintaining the highest industry standards.' },
              { icon: Clock, title: 'Reliability', desc: 'Consistent, dependable supply and support.' },
              { icon: Eye, title: 'Transparency', desc: 'Clear, open communication with partners.' },
              { icon: Recycle, title: 'Sustainability', desc: 'Promoting eco-conscious building practices.' }
            ].map((value, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-stone-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-primary/10 transition-colors">
                  <value.icon className="w-6 h-6 text-brand-secondary group-hover:text-brand-primary transition-colors" />
                </div>
                <h4 className="text-lg font-bold text-brand-secondary mb-3">{value.title}</h4>
                <p className="text-stone-600 text-sm leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: Why Choose AZM Group */}
      <section className="py-24 bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-4">The AZM Advantage</h2>
              <h3 className="text-3xl md:text-5xl font-bold font-display text-brand-secondary mb-6 leading-tight">
                Why Choose AZM Group?
              </h3>
              <p className="text-stone-600 text-lg mb-8">
                We are more than a supplier; we are your strategic partner in building excellence, offering unparalleled support from concept to completion.
              </p>
              <div className="space-y-4 mb-10">
                <Link to="/contact" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-secondary text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-brand-primary transition-all shadow-lg hover:shadow-xl">
                  Start Your Project <ArrowRight size={18} />
                </Link>
                <a href="https://wa.me/971501234567" target="_blank" rel="noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-green-500 text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-green-600 transition-all shadow-lg hover:shadow-xl sm:ml-4">
                  WhatsApp Us <MessageSquare size={18} />
                </a>
              </div>
            </div>
            
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Diamond, title: 'Premium International Brands' },
                { icon: BadgeCheck, title: 'Official VADO Collections' },
                { icon: Users, title: 'Experienced Team' },
                { icon: Lightbulb, title: 'Expert Product Consultation' },
                { icon: Clock, title: 'Fast Project Support' },
                { icon: Truck, title: 'Reliable Supply Chain' },
                { icon: Shield, title: 'Competitive Pricing' },
                { icon: Headphones, title: 'Professional After Sales' },
                { icon: MapPin, title: 'UAE Wide Delivery' },
                { icon: Box, title: 'Large Product Portfolio' }
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-xl border border-stone-100 bg-stone-50 hover:border-brand-primary/30 transition-colors">
                  <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center flex-shrink-0 text-brand-primary">
                    <feature.icon size={20} />
                  </div>
                  <span className="font-bold text-stone-700 text-sm">{feature.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: Our Product Categories */}
      <section className="py-24 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-4">Comprehensive Portfolio</h2>
            <h3 className="text-3xl md:text-5xl font-bold font-display mb-6">Our Product Categories</h3>
            <p className="text-stone-400 text-lg">Curated collections for every aspect of your premium residential or commercial build.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: 'Bathroom Faucets', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop' },
              { name: 'Shower Systems', img: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=400&auto=format&fit=crop' },
              { name: 'Kitchen Mixers', img: 'https://images.unsplash.com/photo-1556910103-1c02745a872f?q=80&w=400&auto=format&fit=crop' },
              { name: 'Accessories', img: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=400&auto=format&fit=crop' },
              { name: 'Wash Basins', img: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?q=80&w=400&auto=format&fit=crop' },
              { name: 'Bathtubs', img: 'https://images.unsplash.com/photo-1507652313519-d4e9174996cb?q=80&w=400&auto=format&fit=crop' },
              { name: 'Vanities', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400&auto=format&fit=crop' },
              { name: 'Toilets', img: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=400&auto=format&fit=crop' },
              { name: 'Mirrors', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop' },
              { name: 'Tiles', img: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=400&auto=format&fit=crop' },
              { name: 'Building Materials', img: 'https://images.unsplash.com/photo-1504307651254-35680f356f90?q=80&w=400&auto=format&fit=crop' },
              { name: 'Hardware', img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=400&auto=format&fit=crop' }
            ].map((cat, idx) => (
              <Link 
                key={idx} 
                to={`/products/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="group relative aspect-square overflow-hidden rounded-xl bg-stone-800"
              >
                <OptimizedImage 
                  src={cat.img} 
                  alt={cat.name}
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6 flex flex-col justify-end">
                  <h4 className="font-bold text-lg text-white group-hover:text-brand-primary transition-colors">{cat.name}</h4>
                  <span className="text-xs uppercase tracking-wider text-stone-300 mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    Explore <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: Our Brands */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-4">World Class Partners</h2>
            <h3 className="text-3xl md:text-5xl font-bold font-display text-brand-secondary mb-6">Our Premium Brands</h3>
            <p className="text-stone-600 text-lg">Partnering with global leaders to bring the finest building materials to the UAE.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-4 bg-white rounded-3xl p-12 border border-stone-200 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 group">
              <div className="max-w-lg">
                <span className="bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">Featured Partner</span>
                <h4 className="text-4xl font-bold font-display text-brand-secondary mb-4">VADO UK</h4>
                <p className="text-stone-600 mb-6">We are a proud supplier of VADO, a leading British bathroom brassware manufacturer renowned for its uncompromising quality and striking designs.</p>
                <Link to="/vado-collection" className="inline-flex items-center gap-2 text-brand-secondary font-bold uppercase tracking-wider hover:text-brand-primary transition-colors pb-1 border-b-2 border-brand-primary">
                  Explore VADO Collections <ArrowRight size={16} />
                </Link>
              </div>
              <div className="w-48 h-48 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center p-8 group-hover:shadow-2xl transition-all">
                <OptimizedImage src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Vado_Logo.svg/1200px-Vado_Logo.svg.png" alt="VADO Logo" className="w-full h-auto grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" fallbackSrc="https://via.placeholder.com/200x100?text=VADO" />
              </div>
            </div>
            
            {['JAQUAR', 'ITALIAN STANDARDS', 'NOURK', 'SANIT'].map((brand, idx) => (
              <div key={idx} className="bg-white aspect-[3/2] rounded-2xl border border-stone-200 flex items-center justify-center p-8 hover:shadow-lg transition-all group cursor-pointer">
                <span className="text-xl font-bold text-stone-400 group-hover:text-brand-secondary transition-colors uppercase tracking-widest text-center">{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9: Industries We Serve */}
      <section className="py-24 bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-4">Project Expertise</h2>
              <h3 className="text-3xl md:text-5xl font-bold font-display text-brand-secondary">Industries We Serve</h3>
            </div>
            <Link to="/projects" className="inline-flex items-center gap-2 text-brand-primary font-bold uppercase tracking-wider hover:text-brand-secondary transition-colors flex-shrink-0">
              View Our Projects <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Building2, title: 'Luxury Villas', desc: 'Bespoke solutions for high-end residential estates.' },
              { icon: Building, title: 'Hotels & Hospitality', desc: 'Durable, luxurious fittings for five-star experiences.' },
              { icon: Factory, title: 'Commercial', desc: 'Robust materials for high-traffic office spaces.' },
              { icon: HeartHandshake, title: 'Healthcare', desc: 'Hygienic, touchless solutions for medical facilities.' },
              { icon: Building2, title: 'Government', desc: 'Reliable supply for large-scale public infrastructure.' },
              { icon: Box, title: 'Retail & Mixed Use', desc: 'Aesthetic and durable materials for diverse environments.' }
            ].map((industry, idx) => (
              <div key={idx} className="flex gap-6 p-8 rounded-2xl bg-stone-50 border border-stone-100 hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center flex-shrink-0">
                  <industry.icon size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-brand-secondary mb-2">{industry.title}</h4>
                  <p className="text-stone-600 text-sm leading-relaxed">{industry.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10: Our Process */}
      <section className="py-24 bg-brand-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-4">How We Work</h2>
            <h3 className="text-3xl md:text-5xl font-bold font-display mb-6">A Seamless Process</h3>
            <p className="text-stone-300 text-lg">From initial inquiry to final handover, our streamlined approach ensures project success.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-white/10 z-0" />
            
            {[
              { step: '01', title: 'Consultation', desc: 'Understanding your project requirements and design intent.' },
              { step: '02', title: 'Selection', desc: 'Expert curation from our premium product portfolio.' },
              { step: '03', title: 'Quotation', desc: 'Detailed, competitive, and transparent pricing.' },
              { step: '04', title: 'Delivery & Support', desc: 'Timely logistics and dedicated after-sales service.' }
            ].map((item, idx) => (
              <div key={idx} className="relative z-10 text-center flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-stone-800 border-4 border-brand-secondary flex items-center justify-center text-2xl font-bold text-brand-primary mb-6 shadow-2xl relative">
                  {item.step}
                  <div className="absolute inset-0 rounded-full border border-brand-primary/30 animate-[ping_3s_infinite]" />
                </div>
                <h4 className="text-xl font-bold mb-3">{item.title}</h4>
                <p className="text-stone-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 11: Our Numbers */}
      <section className="py-20 bg-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-stone-200">
            {[
              { number: '5000+', label: 'Premium Products' },
              { number: '100+', label: 'Brand Collections' },
              { number: '1000+', label: 'Satisfied Clients' },
              { number: 'UAE', label: 'Wide Service Coverage' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center px-4">
                <div className="text-4xl md:text-5xl font-bold font-display text-brand-primary mb-2">{stat.number}</div>
                <div className="text-stone-600 font-bold uppercase tracking-wider text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 12 & 13: Quality and Sustainability */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mb-8">
                <Shield className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="text-3xl font-bold font-display text-brand-secondary mb-6">Commitment to Quality</h3>
              <p className="text-stone-600 text-lg leading-relaxed mb-6">
                Quality assurance is deeply ingrained in the AZM Group ethos. We partner exclusively with trusted manufacturers who adhere to stringent international standards, ensuring that every fixture, tile, and fitting we supply guarantees long-lasting performance.
              </p>
              <p className="text-stone-600 text-lg leading-relaxed">
                Our commitment extends beyond the product itself; we provide professional installation support and technical guidance to ensure our materials perform flawlessly for years to come.
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mb-8">
                <Recycle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold font-display text-brand-secondary mb-6">Driving Sustainability</h3>
              <p className="text-stone-600 text-lg leading-relaxed mb-6">
                We recognize our responsibility to the environment and the communities we serve. AZM Group actively promotes eco-conscious partnerships and prioritizes responsible sourcing in our supply chain.
              </p>
              <p className="text-stone-600 text-lg leading-relaxed">
                By supplying advanced water-saving solutions, such as aerated faucets, and energy-efficient building materials, we help our clients meet rigorous green building certifications (like LEED and Estidama) without compromising on luxury or performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 14: Customer Testimonials */}
      <section className="py-24 bg-stone-50 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-4">Client Feedback</h2>
          <h3 className="text-3xl md:text-5xl font-bold font-display text-brand-secondary mb-16">Trusted by Industry Leaders</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { quote: "AZM Group's extensive portfolio and deep understanding of VADO products made them the perfect partner for our luxury hotel project.", author: "Design Director, International Hotel Group" },
              { quote: "Reliable delivery, competitive pricing, and impeccable quality. They are our go-to supplier for all premium residential builds in Dubai.", author: "Procurement Manager, Top-Tier Contractor" },
              { quote: "The level of technical support provided during the specification phase was outstanding. A truly professional team.", author: "Senior Architect, Boutique Design Firm" }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white p-10 rounded-2xl border border-stone-100 shadow-sm relative text-left">
                <Quote className="absolute top-8 right-8 text-stone-100 w-16 h-16" />
                <div className="flex gap-1 text-brand-primary mb-6 relative z-10">
                  {[...Array(5)].map((_, i) => <Star key={i} className="fill-current w-4 h-4" />)}
                </div>
                <p className="text-stone-700 text-lg leading-relaxed mb-8 relative z-10 font-medium">"{testimonial.quote}"</p>
                <p className="text-stone-500 text-xs font-bold uppercase tracking-wider border-t border-stone-100 pt-6">{testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 15: Frequently Asked Questions */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-4">Knowledge Base</h2>
            <h3 className="text-3xl md:text-5xl font-bold font-display text-brand-secondary">Frequently Asked Questions</h3>
          </div>
          
          <div className="space-y-4">
            {[
              { q: 'Why choose AZM Group?', a: 'AZM Group offers a curated portfolio of premium international brands, expert consultation, fast project support, and competitive pricing for luxury building materials.' },
              { q: 'Do you supply VADO products in UAE?', a: 'Yes, we are a proud supplier of VADO UK collections, offering their full range of exquisite British brassware and bathroom solutions across the UAE.' },
              { q: 'Can contractors request quotations?', a: 'Absolutely. We provide dedicated support and competitive B2B pricing for contractors, developers, and architects on residential and commercial projects.' },
              { q: 'Do you support commercial projects?', a: 'Yes, our experienced team supports large-scale commercial projects, hotels, healthcare facilities, and mixed-use developments with tailored solutions.' },
              { q: 'Do you deliver across UAE?', a: 'Yes, we provide reliable, UAE-wide delivery through our robust supply chain network, ensuring your materials arrive safely and on time.' }
            ].map((faq, idx) => (
              <div key={idx} className="border border-stone-200 rounded-xl overflow-hidden bg-stone-50">
                <button 
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none focus:bg-stone-100 transition-colors"
                >
                  <span className="font-bold text-brand-secondary">{faq.q}</span>
                  <ChevronDown className={`text-stone-400 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180 text-brand-primary' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-6 pt-0 text-stone-600 leading-relaxed border-t border-stone-200 bg-white">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 16: Final Call To Action */}
      <section className="py-32 bg-stone-900 text-white relative overflow-hidden">
        {/* Abstract Background pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold font-display mb-8 leading-tight">Let's Build Exceptional Spaces Together</h2>
          <p className="text-xl text-stone-400 mb-12 max-w-2xl mx-auto">
            Ready to elevate your next project? Our team of experts is ready to provide tailored quotations, technical advice, and premium supply services.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact?tab=quote" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-primary text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-brand-secondary transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
              Request Quote <ArrowRight size={18} />
            </Link>
            <a href="https://wa.me/971501234567" target="_blank" rel="noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-green-500 text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-green-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
              WhatsApp Us <MessageSquare size={18} />
            </a>
            <Link to="/contact?tab=showroom" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-white hover:text-brand-secondary transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
              Visit Showroom <MapPin size={18} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

// Inline Star component for testimonials
function Star(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
