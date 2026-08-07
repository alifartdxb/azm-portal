import React, { useState, useEffect } from 'react';
import { X, Upload, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { createDocument } from '../services/db';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: {
    name: string;
    sku: string;
    brand: string;
    category: string;
  };
}

export function InquiryModal({ isOpen, onClose, product }: InquiryModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    mobileNumber: '',
    country: '',
    quantity: '',
    projectName: '',
    message: '',
    contactMethod: 'Email'
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSuccess(false);
      setFormData(prev => ({
        ...prev,
        fullName: '',
        companyName: '',
        email: '',
        mobileNumber: '',
        country: '',
        quantity: '',
        projectName: '',
        message: '',
        contactMethod: 'Email'
      }));
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const inquiryData = {
        name: formData.fullName,
        company: formData.companyName,
        email: formData.email,
        phone: formData.mobileNumber,
        country: formData.country,
        productName: product?.name || '',
        sku: product?.sku || '',
        brand: product?.brand || '',
        category: product?.category || '',
        productUrl: product ? window.location.href : '',
        quantity: formData.quantity,
        projectName: formData.projectName,
        message: formData.message,
        preferredContact: formData.contactMethod,
        status: 'New',
        createdAt: new Date().toISOString(),
      };
      
      await createDocument('inquiries', inquiryData);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Failed to submit inquiry:', error);
      alert('Failed to submit inquiry. Please try again or contact us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center bg-stone-50">
              <h2 className="text-xl font-bold font-display text-brand-secondary">Request Product Inquiry</h2>
              <button 
                onClick={onClose}
                className="p-2 text-stone-400 hover:text-stone-600 bg-white rounded-full border border-stone-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              {success ? (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-stone-800 mb-2">Inquiry Submitted</h3>
                  <p className="text-stone-500 max-w-sm mx-auto">
                    Thank you for your inquiry. Our team will review your request and get back to you shortly.
                  </p>
                </div>
              ) : (
                <form id="inquiry-form" onSubmit={handleSubmit} className="space-y-6">
                  {product && (
                    <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                      <div className="flex-1">
                        <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Product Details</p>
                        <h4 className="font-bold text-stone-800">{product.name}</h4>
                        <div className="text-sm text-stone-600 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                          <span>SKU: {product.sku}</span>
                          {product.brand && <span>Brand: {product.brand}</span>}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-stone-700 mb-1">Full Name *</label>
                      <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-brand-primary focus:border-brand-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-700 mb-1">Company Name</label>
                      <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-brand-primary focus:border-brand-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-700 mb-1">Email Address *</label>
                      <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-brand-primary focus:border-brand-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-700 mb-1">Mobile Number *</label>
                      <input required type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-brand-primary focus:border-brand-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-700 mb-1">Country</label>
                      <input type="text" name="country" value={formData.country} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-brand-primary focus:border-brand-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-700 mb-1">Quantity Required</label>
                      <input type="number" min="1" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-brand-primary focus:border-brand-primary" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-bold text-stone-700 mb-1">Project Name</label>
                      <input type="text" name="projectName" value={formData.projectName} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-brand-primary focus:border-brand-primary" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-bold text-stone-700 mb-1">Message</label>
                      <textarea name="message" rows={3} value={formData.message} onChange={handleChange} className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-brand-primary focus:border-brand-primary" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-bold text-stone-700 mb-2">Preferred Contact Method</label>
                      <div className="flex flex-wrap gap-4">
                        {['WhatsApp', 'Phone', 'Email'].map((method) => (
                          <label key={method} className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name="contactMethod" 
                              value={method} 
                              checked={formData.contactMethod === method}
                              onChange={handleChange}
                              className="text-brand-primary focus:ring-brand-primary border-stone-300"
                            />
                            <span className="text-sm font-medium text-stone-700">{method}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {!success && (
              <div className="px-6 py-4 border-t border-stone-100 bg-stone-50 flex justify-end gap-3 shrink-0">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="px-6 py-2.5 border border-stone-200 text-stone-600 rounded-lg font-bold text-sm hover:bg-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  form="inquiry-form"
                  disabled={loading}
                  className="px-6 py-2.5 bg-brand-primary text-white rounded-lg font-bold text-sm hover:bg-brand-secondary transition-colors shadow-sm disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Inquiry'}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
