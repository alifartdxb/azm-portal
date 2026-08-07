import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, Phone, Mail, ChevronUp, ChevronDown, X, MessageSquare, MapPin, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { InquiryModal } from "./InquiryModal";

export function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  const [whatsappMessage, setWhatsappMessage] = useState('Hello AZM Group, I would like to know more about your products and request assistance.');

  useEffect(() => {
    // Adapt message based on current page
    if (location.pathname.includes('/products/')) {
       setWhatsappMessage(`Hello AZM Group, I am interested in a product I saw on your website (${window.location.href}) and would like more information.`);
    } else if (location.pathname === '/book-showroom') {
       setWhatsappMessage('Hello AZM Group, I would like to arrange a showroom visit.');
    } else {
       setWhatsappMessage('Hello AZM Group, I would like to know more about your products and request assistance.');
    }
  }, [location]);

  return (
    <>
      {/* Desktop Floating Menu */}
      <div className="fixed bottom-6 left-6 z-50 hidden md:flex flex-col gap-3">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="flex flex-col gap-3 mb-2"
            >
              <a href={`https://wa.me/971558090292?text=${encodeURIComponent(whatsappMessage)}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-white p-3 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="w-10 h-10 bg-[#25D366] text-white rounded-full flex items-center justify-center">
                  <MessageCircle size={20} />
                </div>
                <span className="font-bold text-sm text-stone-700 pr-3 group-hover:text-[#25D366] transition-colors">WhatsApp</span>
              </a>
              <a href="tel:+971558090292" className="flex items-center gap-3 bg-white p-3 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="w-10 h-10 bg-brand-primary text-white rounded-full flex items-center justify-center">
                  <Phone size={20} />
                </div>
                <span className="font-bold text-sm text-stone-700 pr-3 group-hover:text-brand-primary transition-colors">Call Now</span>
              </a>
              <button onClick={() => { setIsModalOpen(true); setIsOpen(false); }} className="flex items-center gap-3 bg-white p-3 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="w-10 h-10 bg-brand-secondary text-white rounded-full flex items-center justify-center">
                  <Mail size={20} />
                </div>
                <span className="font-bold text-sm text-stone-700 pr-3 group-hover:text-brand-secondary transition-colors">Quick Inquiry</span>
              </button>
              <a href="/book-showroom" className="flex items-center gap-3 bg-white p-3 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="w-10 h-10 bg-stone-800 text-white rounded-full flex items-center justify-center">
                  <MapPin size={20} />
                </div>
                <span className="font-bold text-sm text-stone-700 pr-3 group-hover:text-stone-900 transition-colors">Visit Showroom</span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-stone-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform relative z-10"
        >
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </button>
      </div>

      {/* Mobile Sticky Contact Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 z-40 flex md:hidden items-center justify-between px-2 py-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <a href="tel:+971558090292" className="flex flex-col items-center justify-center flex-1 py-2 text-stone-600 hover:text-brand-primary transition-colors">
          <Phone size={20} className="mb-1" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Call</span>
        </a>
        <a href={`https://wa.me/971558090292?text=${encodeURIComponent(whatsappMessage)}`} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center flex-1 py-2 text-[#25D366]">
          <MessageCircle size={20} className="mb-1" />
          <span className="text-[10px] font-bold uppercase tracking-wider">WhatsApp</span>
        </a>
        <a href="/book-showroom" className="flex flex-col items-center justify-center flex-1 py-2 text-stone-600 hover:text-brand-primary transition-colors">
          <MapPin size={20} className="mb-1" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Showroom</span>
        </a>
        <button onClick={() => setIsModalOpen(true)} className="flex flex-col items-center justify-center flex-1 py-2 text-stone-600 hover:text-brand-primary transition-colors">
          <FileText size={20} className="mb-1" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Inquiry</span>
        </button>
      </div>
      <InquiryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
