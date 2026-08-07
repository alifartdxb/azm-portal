import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function FilterSection({ 
  title, 
  titleAr,
  options, 
  selected, 
  toggle,
  isRtl = false
}: { 
  title: string, 
  titleAr?: string,
  options: {id: string, name: string, nameAr?: string}[], 
  selected: string[], 
  toggle: (val: string) => void,
  isRtl?: boolean
}) {
  const [isOpen, setIsOpen] = useState(true);
  if (!options || options.length === 0) return null;
  
  const displayTitle = isRtl && titleAr ? titleAr : title;

  return (
    <div className={`border-b border-stone-200 pb-6 ${isRtl ? 'text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full font-bold text-sm uppercase tracking-widest text-brand-secondary mb-4"
      >
        <span>{displayTitle}</span>
        <ChevronRight size={16} className={`transform transition-transform ${isOpen ? (isRtl ? 'rotate-90' : 'rotate-90') : (isRtl ? 'rotate-180' : '')} ${isOpen && isRtl ? '-rotate-90' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 pt-2 max-h-60 overflow-y-auto custom-scrollbar">
              {options.map((opt) => {
                const displayName = isRtl && opt.nameAr ? opt.nameAr : opt.name;
                return (
                  <label key={opt.id} className="flex items-start gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 mt-0.5 shrink-0 rounded border flex items-center justify-center transition-colors ${selected.includes(opt.id) ? 'bg-brand-primary border-brand-primary text-white' : 'border-stone-300 group-hover:border-brand-primary'}`}>
                      {selected.includes(opt.id) && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                    </div>
                    <span className={`text-sm leading-tight ${selected.includes(opt.id) ? 'font-bold text-brand-secondary' : 'text-stone-600 group-hover:text-brand-primary transition-colors'} ${isRtl && opt.nameAr ? 'font-arabic' : ''}`}>
                      {displayName}
                    </span>
                  </label>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
