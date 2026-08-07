import React from 'react';
import { useInquiry } from '../contexts/InquiryContext';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function InquiryWidget() {
  const { itemCount } = useInquiry();

  return (
    <AnimatePresence>
      {itemCount > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-6 left-6 z-50 flex items-center justify-end"
        >
          <Link 
            to="/inquiry" 
            className="group flex items-center bg-brand-secondary text-white rounded-full shadow-2xl overflow-hidden hover:shadow-[0_10px_40px_rgba(0,0,0,0.2)] transition-all duration-300"
          >
            <div className="flex items-center gap-2 px-5 py-4">
              <div className="relative">
                <FileText size={22} className="group-hover:text-brand-primary transition-colors" />
                <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-brand-secondary">
                  {itemCount}
                </span>
              </div>
              <span className="font-bold text-sm uppercase tracking-wider ml-1">Inquiry List</span>
              <ArrowRight size={18} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
