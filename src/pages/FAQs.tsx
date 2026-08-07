import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { SEO } from '../components/SEO';
import { getCollection } from '../services/db';

export function FAQs() {
  const [faqs, setFaqs] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    async function loadData() {
      const data = await getCollection('faqs');
      setFaqs(data.filter((f: any) => f.status === 'Published'));
    }
    loadData();
  }, []);

  const categories = [...new Set(faqs.map((f: any) => f.category))];


  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((f: any) => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  };

  return (
    <div className="pt-32 pb-24 bg-stone-50 min-h-screen">
      <SEO 
        title="Frequently Asked Questions | AZM Group"
        description="Find answers to common questions about premium building materials, sanitary ware, tiles, and our delivery services in the UAE."
        schemas={[faqSchema]}
      />

      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-secondary mb-6">Frequently Asked Questions</h1>
          <p className="text-lg text-stone-600">Find answers to common questions about our products and services.</p>
        </div>
        
        <div className="space-y-12">
          {categories.map(category => (
            <div key={category}>
              <h2 className="text-2xl font-bold font-display text-brand-secondary mb-6">{category}</h2>
              <div className="space-y-4">
                {faqs.filter((f: any) => f.category === category).map((faq: any) => (
                  <div key={faq.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden transition-all">
                    <button 
                      onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                      className="w-full flex items-center justify-between p-6 text-left font-bold text-stone-800 hover:text-brand-primary transition-colors"
                    >
                      {faq.question}
                      <ChevronDown className={`transition-transform ${openId === faq.id ? 'rotate-180 text-brand-primary' : 'text-stone-400'}`} />
                    </button>
                    {openId === faq.id && (
                      <div className="px-6 pb-6 text-stone-600 prose">{faq.answer}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}