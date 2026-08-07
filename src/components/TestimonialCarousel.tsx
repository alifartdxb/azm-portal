import React, { useState, useEffect, useRef } from 'react';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { getCollection } from '../services/db';
import { motion, AnimatePresence } from 'motion/react';

const DEFAULT_TESTIMONIALS = [
  { quote: "AZM Group has consistently delivered exceptional product quality and technical support for our luxury residential developments. Their understanding of high-end brassware is unmatched.", author: "Sarah Al Mansoori", role: "Principal Architect, Dubai", type: "Architects" },
  { quote: "The VADO collections supplied by AZM transformed our hotel's bathrooms into true sanctuaries. Flawless execution and reliable post-sales service.", author: "James Peterson", role: "Project Director, Hospitality Group", type: "Hotels" },
  { quote: "A reliable partner for large-scale commercial projects. Their ability to source premium European ceramics and deliver on tight timelines is highly commendable.", author: "Ahmed Tariq", role: "Lead Developer, Abu Dhabi", type: "Commercial Projects" }
];

export function TestimonialCarousel() {
  const [testimonials, setTestimonials] = useState<any[]>(DEFAULT_TESTIMONIALS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const data = await getCollection('testimonials');
        if (data && data.length > 0) {
          setTestimonials(data.filter((t: any) => t.status !== 'Draft'));
        }
      } catch (e) {
        console.error("Failed to load testimonials", e);
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonials();
  }, []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipe();
  };

  const handleSwipe = () => {
    if (touchEndX.current < touchStartX.current - 50) handleNext();
    if (touchEndX.current > touchStartX.current + 50) handlePrev();
  };

  return (
    <section className="py-24 bg-brand-secondary text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-24 items-center">
          
          <div className="md:w-1/3">
            <h2 className="text-4xl font-bold tracking-tight mb-6 font-display">Client Endorsements</h2>
            <p className="text-white/60 text-lg mb-12">Trusted by the most prestigious architectural practices in the Middle East.</p>
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-4xl font-bold font-display text-brand-primary mb-2">5000+</p>
                <p className="text-xs uppercase tracking-widest text-white/50 font-semibold">Products Supplied</p>
              </div>
              <div>
                <p className="text-4xl font-bold font-display text-brand-primary mb-2">2500+</p>
                <p className="text-xs uppercase tracking-widest text-white/50 font-semibold">Happy Customers</p>
              </div>
              <div>
                <p className="text-4xl font-bold font-display text-brand-primary mb-2">500+</p>
                <p className="text-xs uppercase tracking-widest text-white/50 font-semibold">Projects Supported</p>
              </div>
              <div>
                <p className="text-4xl font-bold font-display text-brand-primary mb-2">15+</p>
                <p className="text-xs uppercase tracking-widest text-white/50 font-semibold">Global Brands</p>
              </div>
            </div>
          </div>

          <div 
            className="md:w-2/3 relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="bg-white/5 border border-white/10 p-10 lg:p-16 rounded-3xl backdrop-blur-sm relative min-h-[400px] flex flex-col justify-between">
              <Quote size={60} className="text-brand-primary/20 absolute top-10 right-10" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="flex-grow flex flex-col justify-center"
                >
                  <div className="flex gap-1 text-yellow-400 mb-6">
                    {[1,2,3,4,5].map(star => <Star key={star} size={16} fill="currentColor" />)}
                  </div>
                  <p className="text-xl lg:text-2xl text-white/90 leading-relaxed mb-8 italic">
                    "{testimonials[currentIndex].quote}"
                  </p>
                  <div>
                    <h4 className="font-bold text-white uppercase tracking-wider text-lg">{testimonials[currentIndex].author}</h4>
                    <p className="text-brand-primary text-sm font-semibold uppercase mb-1">{testimonials[currentIndex].role}</p>
                    <p className="text-xs text-white/40 uppercase tracking-widest">{testimonials[currentIndex].type}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/10">
                <div className="flex gap-2">
                  {testimonials.map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-brand-primary w-8' : 'bg-white/20 hover:bg-white/50'}`}
                      aria-label={`Go to testimonial ${i + 1}`}
                    />
                  ))}
                </div>
                <div className="flex gap-4">
                  <button onClick={handlePrev} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white transition-colors">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={handleNext} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white transition-colors">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
