import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { getCollection } from '../services/db';
import { OptimizedImage } from '../components/OptimizedImage';
import { ArrowRight, ArrowLeft, Search, Filter, MessageCircle } from 'lucide-react';
import { useInquiry } from '../contexts/InquiryContext';

export function ProductFinder() {
  const { addItem, toggleInquiryModal } = useInquiry();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [step, setStep] = useState(0);
  
  const [answers, setAnswers] = useState({
    category: '',
    projectType: '',
    application: '',
    style: '',
    brand: ''
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await getCollection('products');
        setProducts(data.filter((p: any) => p.status !== 'Draft'));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const getDistinct = (field: string) => {
    const vals = products.map(p => p[field]).filter(Boolean);
    return [...new Set(vals)] as string[];
  };

  const steps = [
    {
      id: 'category',
      question: 'What type of product are you looking for?',
      options: ['Tiles', 'Wash Basins', 'Bathroom Faucets', 'Shower Systems', 'Water Closets', 'Bathtubs', 'Accessories']
    },
    {
      id: 'projectType',
      question: 'Is this for a residential or commercial project?',
      options: ['Residential', 'Commercial', 'Hospitality', 'Healthcare', 'Other']
    },
    {
      id: 'style',
      question: 'What is your preferred style?',
      options: ['Modern', 'Classic', 'Minimalist', 'Industrial', 'Luxury']
    },
    {
      id: 'brand',
      question: 'Do you have a preferred brand?',
      options: ['Any Brand', ...getDistinct('brand')]
    }
  ];

  const handleSelect = (option: string) => {
    setAnswers(prev => ({ ...prev, [steps[step].id]: option }));
    if (step < steps.length) {
      setStep(step + 1);
    }
  };

  const getResults = () => {
    return products.filter(p => {
      let match = true;
      if (answers.category && answers.category !== 'Any' && p.category !== answers.category) match = false;
      if (answers.brand && answers.brand !== 'Any Brand' && p.brand !== answers.brand) match = false;
      return match;
    });
  };

  if (loading) return <div className="min-h-screen pt-32 flex justify-center"><div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div></div>;

  const results = step === steps.length ? getResults() : [];

  return (
    <div className="pt-24 pb-24 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-secondary mb-4">Interactive Product Finder</h1>
          <p className="text-stone-600">Answer a few quick questions and we'll recommend the perfect products for your project.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden min-h-[400px] flex flex-col relative">
          {step < steps.length ? (
            <div className="p-8 md:p-12 flex-grow flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <span className="text-sm font-bold text-stone-400 uppercase tracking-wider">Step {step + 1} of {steps.length}</span>
                {step > 0 && (
                  <button onClick={() => setStep(step - 1)} className="text-stone-500 hover:text-brand-primary flex items-center gap-1 text-sm font-bold">
                    <ArrowLeft size={16} /> Back
                  </button>
                )}
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-stone-800 mb-8">{steps[step].question}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {steps[step].options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => handleSelect(opt)}
                    className="p-4 border-2 border-stone-100 rounded-xl hover:border-brand-primary hover:bg-brand-primary/5 text-center font-bold text-stone-700 transition-all text-sm md:text-base"
                  >
                    {opt}
                  </button>
                ))}
              </div>
              
              <div className="mt-auto pt-8 flex justify-end">
                <button 
                  onClick={() => setStep(steps.length)}
                  className="text-stone-400 hover:text-stone-600 text-sm font-medium underline"
                >
                  Skip Wizard & View All
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 md:p-12">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-display font-bold text-stone-800">Your Recommendations</h2>
                  <p className="text-stone-500">{results.length} products found based on your preferences.</p>
                </div>
                <button onClick={() => { setStep(0); setAnswers({ category: '', projectType: '', application: '', style: '', brand: '' }); }} className="text-brand-primary hover:text-brand-secondary flex items-center gap-1 text-sm font-bold">
                  Start Over
                </button>
              </div>

              {results.length === 0 ? (
                <div className="text-center py-12 bg-stone-50 rounded-xl">
                  <p className="text-stone-500 mb-4">We couldn't find exact matches. Try adjusting your preferences.</p>
                  <button onClick={() => setStep(0)} className="px-6 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-secondary transition-colors">
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.slice(0, 6).map(p => {
                    const brandSlug = p.brand?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'brand';
                    const catSlug = p.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'category';
                    const pSlug = p.slug || p.sku || p.id;
                    const link = `/products/${brandSlug}/${catSlug}/${pSlug}`;
                    
                    return (
                    <div key={p.id} className="border border-stone-200 rounded-xl overflow-hidden group hover:shadow-lg transition-all">
                      <div className="aspect-square bg-stone-100 p-6 relative">
                        <OptimizedImage src={p.mainImage || p.thumbnail || p.images?.[0]} alt={p.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-4">
                        <p className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-1">{p.brand}</p>
                        <h3 className="font-bold text-stone-800 mb-2 line-clamp-1">{p.name || p.sku}</h3>
                        <div className="flex gap-2">
                          <Link to={link} className="flex-1 text-center py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold uppercase tracking-wider rounded transition-colors">
                            View
                          </Link>
                          <Link to={`/compare?add=${p.id}`} className="flex-1 text-center py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold uppercase tracking-wider rounded transition-colors">
                            Compare
                          </Link>
                        </div>
                      </div>
                    </div>
                  )})}
                </div>
              )}
              
              {results.length > 0 && (
                <div className="mt-8 pt-8 border-t border-stone-100 flex flex-wrap justify-between items-center gap-4">
                  <p className="text-stone-500 text-sm">Need more help choosing?</p>
                  <div className="flex gap-4">
                    <button onClick={() => toggleInquiryModal()} className="px-6 py-2 bg-stone-900 text-white font-bold rounded-lg hover:bg-brand-primary transition-colors text-sm">
                      Request Advice
                    </button>
                    <a href={`https://wa.me/971558090292?text=Hi, I need help finding ${answers.category || 'products'} for my ${answers.projectType || 'project'}`} target="_blank" rel="noreferrer" className="px-6 py-2 bg-[#25D366] text-white font-bold rounded-lg hover:bg-[#128C7E] transition-colors flex items-center gap-2 text-sm">
                      <MessageCircle size={16} /> WhatsApp Us
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
