import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SEO } from '../components/SEO';
import { MapPin, Phone, MessageCircle, Mail, Calendar, Clock, CheckCircle2, Building2 } from 'lucide-react';
import { createDocument, getCollection } from '../services/db';

export function BookShowroom() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  
  // Settings from admin (placeholder defaults)
  const [settings, setSettings] = useState({
    address: 'Shop 12, Building Materials Mall, Warsan-3, Dubai',
    googleMapsUrl: 'https://www.google.com/maps?q=25.161985,55.461234',
    workingHours: 'Mon - Sun | 9:00 AM - 9:00 PM',
    telephone: '+971 4 28 444 52',
    whatsapp: '+971 55 8090 292',
    email: 'sales@alzahrabm.com',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    availableTimeSlots: ['10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM']
  });

  useEffect(() => {
    // Fetch settings from db if needed
    const fetchSettings = async () => {
      try {
        const sysSettings = await getCollection('settings');
        const showroomSettings = sysSettings.find((s: any) => s.id === 'showroom');
        if (showroomSettings) {
          setSettings(prev => ({ ...prev, ...showroomSettings }));
        }
      } catch (err) {
        console.error("Error fetching showroom settings", err);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries());
      
      const refNumber = `BKV-${Date.now().toString().slice(-6)}`;
      
      const payload = {
        ...data,
        type: 'Showroom Visit',
        referenceNumber: refNumber,
        createdAt: new Date().toISOString(),
        status: 'New'
      };

      await createDocument('inquiries', payload);
      
      setBookingRef(refNumber);
      setIsSuccess(true);
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error processing your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20 md:pb-0">
      <SEO 
        title="Book Showroom Visit | AZM Group" 
        description="Schedule a consultation at the AZM Group showroom in Dubai to view our premium bathroom fittings and building materials."
      />
      
      {/* Header */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-24 bg-stone-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80" alt="Showroom" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/50 to-stone-900"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight mb-6"
          >
            Book a Showroom Visit
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-stone-300 max-w-2xl mx-auto"
          >
            Experience our premium building materials and bathroom solutions in person with a dedicated consultant.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Form Section */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl border border-stone-200 p-12 text-center shadow-xl h-full flex flex-col justify-center items-center"
                  >
                    <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-stone-800 mb-4 font-display">Booking Confirmed!</h2>
                    <p className="text-stone-600 mb-6 text-lg max-w-md">
                      Thank you for booking a visit. A consultant will contact you shortly to confirm your appointment.
                    </p>
                    <div className="bg-stone-50 p-6 rounded-xl border border-stone-200 mb-8 w-full max-w-sm">
                      <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Booking Reference</p>
                      <p className="text-2xl font-bold text-brand-primary">{bookingRef}</p>
                    </div>
                    
                    <a 
                      href={`https://wa.me/971558090292?text=${encodeURIComponent(`Hello AZM Group, I have booked a showroom visit.\nReference: *${bookingRef}*\nPlease confirm my appointment.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-8 py-4 bg-[#25D366] text-white rounded-lg font-bold uppercase tracking-wider hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={18} /> Confirm via WhatsApp
                    </a>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm"
                  >
                    <h2 className="text-2xl font-bold text-stone-800 mb-8 border-b border-stone-100 pb-4">Visitor Details</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Full Name *</label>
                          <input required type="text" name="name" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-primary focus:bg-white transition-colors" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Company Name (Optional)</label>
                          <input type="text" name="company" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-primary focus:bg-white transition-colors" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Email Address *</label>
                          <input required type="email" name="email" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-primary focus:bg-white transition-colors" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Customer Type *</label>
                          <select required name="customerType" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-primary focus:bg-white transition-colors text-stone-700">
                            <option value="">Select an option</option>
                            <option value="Architect/Designer">Architect / Interior Designer</option>
                            <option value="Contractor/Builder">Contractor / Builder</option>
                            <option value="Consultant">Consultant</option>
                            <option value="Homeowner">Homeowner</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Mobile Number *</label>
                          <input required type="tel" name="phone" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-primary focus:bg-white transition-colors" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">WhatsApp Number</label>
                          <input type="tel" name="whatsapp" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-primary focus:bg-white transition-colors" />
                        </div>
                      </div>

                      <h2 className="text-2xl font-bold text-stone-800 mb-8 border-b border-stone-100 pb-4 pt-4">Appointment Details</h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 flex items-center gap-2"><Calendar size={14}/> Preferred Date *</label>
                          <input required type="date" name="preferredDate" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-primary focus:bg-white transition-colors text-stone-700" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 flex items-center gap-2"><Clock size={14}/> Preferred Time *</label>
                          <select required name="preferredTime" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-primary focus:bg-white transition-colors text-stone-700">
                            <option value="">Select time slot</option>
                            {settings.availableTimeSlots.map((slot, i) => (
                              <option key={i} value={slot}>{slot}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 flex items-center gap-2">Number of Visitors</label>
                          <input type="number" name="visitorsCount" defaultValue="1" min="1" max="10" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-primary focus:bg-white transition-colors" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Project Type</label>
                          <select name="projectType" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-primary focus:bg-white transition-colors text-stone-700">
                            <option value="">Select project type</option>
                            <option value="Residential (Villa)">Residential (Villa)</option>
                            <option value="Residential (Apartment)">Residential (Apartment)</option>
                            <option value="Commercial">Commercial / Office</option>
                            <option value="Hospitality">Hospitality / Hotel</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Product Interests</label>
                        <input type="text" name="productInterests" placeholder="e.g. VADO Faucets, Porcelain Tiles..." className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-primary focus:bg-white transition-colors" />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Additional Message or Requirements</label>
                        <textarea name="message" rows={4} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-primary focus:bg-white transition-colors resize-none"></textarea>
                      </div>

                      <div className="pt-4 border-t border-stone-100">
                        <button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="w-full bg-stone-900 text-white py-4 px-6 rounded-lg font-bold uppercase tracking-wider hover:bg-brand-primary transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          ) : (
                            <>Submit Booking Request</>
                          )}
                        </button>
                        <p className="text-[10px] text-stone-400 text-center uppercase tracking-wider mt-4">
                          By submitting this form, you agree to our privacy policy.
                        </p>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar Details */}
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-brand-secondary text-white p-8 rounded-2xl shadow-lg relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Building2 size={120} />
                </div>
                <h3 className="text-xl font-bold font-display mb-6 relative z-10">Showroom Details</h3>
                
                <div className="space-y-6 relative z-10">
                  <div className="flex gap-4">
                    <MapPin className="text-brand-primary shrink-0" size={24} />
                    <div>
                      <p className="font-bold text-sm mb-1 uppercase tracking-wider text-brand-primary">Location</p>
                      <p className="text-sm leading-relaxed text-stone-300">{settings.address}</p>
                      <a href={settings.googleMapsUrl} target="_blank" rel="noreferrer" className="inline-block mt-2 text-xs font-bold uppercase tracking-wider hover:text-white transition-colors underline underline-offset-4">Get Directions</a>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Clock className="text-brand-primary shrink-0" size={24} />
                    <div>
                      <p className="font-bold text-sm mb-1 uppercase tracking-wider text-brand-primary">Opening Hours</p>
                      <p className="text-sm text-stone-300">{settings.workingHours}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Phone className="text-brand-primary shrink-0" size={24} />
                    <div>
                      <p className="font-bold text-sm mb-1 uppercase tracking-wider text-brand-primary">Telephone</p>
                      <a href={`tel:${settings.telephone.replace(/[^0-9+]/g, '')}`} className="text-sm text-stone-300 hover:text-white transition-colors">{settings.telephone}</a>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <MessageCircle className="text-brand-primary shrink-0" size={24} />
                    <div>
                      <p className="font-bold text-sm mb-1 uppercase tracking-wider text-brand-primary">WhatsApp</p>
                      <a href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-sm text-stone-300 hover:text-white transition-colors">{settings.whatsapp}</a>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <div className="bg-stone-100 p-8 rounded-2xl border border-stone-200">
                <h3 className="text-lg font-bold text-stone-800 mb-4">Why Book a Visit?</h3>
                <ul className="space-y-3">
                  {['Dedicated consultation with product experts', 'Access to physical material samples', 'Review technical specifications', 'Discuss trade pricing and volume discounts', 'Explore new collections firsthand'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-stone-600">
                      <CheckCircle2 size={16} className="text-brand-primary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
