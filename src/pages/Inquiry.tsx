import React, { useState, useRef } from 'react';
import { useInquiry } from '../contexts/InquiryContext';
import { Link, useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { Trash2, Plus, Minus, FileText, Send, Printer, Download, MessageCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { OptimizedImage } from '../components/OptimizedImage';
import { motion, AnimatePresence } from 'motion/react';
import { createDocument } from '../services/db';

export function Inquiry() {
  const { items, removeItem, updateQuantity, updateUnit, updateNotes, clearInquiry, itemCount } = useInquiry();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  
  // For print/download
  const printRef = useRef<HTMLDivElement>(null);

  const generateReference = () => {
    return 'AZM-INQ-' + Math.random().toString(36).substr(2, 6).toUpperCase();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    let csv = 'SKU,Product Name,Brand,Quantity,Unit,Notes\n';
    items.forEach(item => {
      csv += `"${item.product.sku}","${item.product.name}","${item.product.brand || ''}",${item.quantity},"${item.unit}","${item.notes || ''}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AZM-Inquiry-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const generateWhatsAppMessage = () => {
    let msg = `*New Inquiry for AZM Group*\n\n`;
    msg += `I am interested in the following products:\n\n`;
    items.forEach((item, index) => {
      msg += `${index + 1}. *${item.product.name}* (SKU: ${item.product.sku})\n`;
      msg += `   Qty: ${item.quantity} ${item.unit}\n`;
      if (item.notes) msg += `   Notes: ${item.notes}\n`;
      msg += `\n`;
    });
    msg += `Please provide a quotation and availability.`;
    return msg;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const file = formData.get('attachment') as File;
      
      // File validation
      if (file && file.size > 0) {
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          alert('Attachment size exceeds 5MB limit. Please upload a smaller file.');
          setIsSubmitting(false);
          return;
        }
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/jpg', 'application/acad', 'image/vnd.dwg'];
        // Note: DWG MIME types vary, so we also rely on the accept attribute and file extension.
        const ext = file.name.split('.').pop()?.toLowerCase();
        const allowedExts = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'dwg'];
        if (!allowedExts.includes(ext || '')) {
           alert('Invalid file format. Please upload PDF, DOC, DOCX, JPG, PNG, or DWG.');
           setIsSubmitting(false);
           return;
        }
      }

      const data = Object.fromEntries(formData.entries());
      // Handle file conversion to avoid payload too large if saving directly (ideally would use Storage, but we'll remove it from the DB payload for this prototype or just save name)
      if (data.attachment && (data.attachment as File).size > 0) {
         data.attachmentName = (data.attachment as File).name;
      }
      delete data.attachment;

      
      // Basic Honeypot (add a hidden field in JSX)
      if (data.website_url) {
        throw new Error("Spam detected");
      }
      
      const refNum = generateReference();
      
      const payload = {
        ...data,
        type: 'Product Inquiry',
        referenceNumber: refNum,
        status: 'New',
        source: 'Website Inquiry List',
        items: items.map(i => ({
          productId: i.product.id,
          sku: i.product.sku,
          name: i.product.name,
          brand: i.product.brand || '',
          quantity: i.quantity,
          unit: i.unit,
          notes: i.notes
        })),
        createdAt: new Date().toISOString(),
        utm_source: new URLSearchParams(window.location.search).get('utm_source') || '',
        utm_medium: new URLSearchParams(window.location.search).get('utm_medium') || '',
      };
      
      await createDocument('inquiries', payload);
      
      setReferenceNumber(refNum);
      setIsSubmitted(true);
      clearInquiry();
      window.scrollTo(0, 0);
      
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      alert("Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[70vh] bg-stone-50 py-12 px-4">
        <SEO title="Inquiry Submitted | AZM Group" />
        <div className="bg-white p-10 md:p-16 rounded-2xl shadow-sm border border-stone-200 text-center max-w-2xl w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-display text-brand-secondary mb-4">Inquiry Received</h1>
          <p className="text-stone-600 text-lg mb-8 leading-relaxed">
            Thank you for your interest in AZM Group. We have received your multi-product inquiry successfully. Our commercial team will review your requirements and get back to you shortly.
          </p>
          
          <div className="bg-stone-50 p-6 rounded-xl border border-stone-200 mb-10">
            <p className="text-sm text-stone-500 uppercase tracking-wider font-bold mb-2">Your Inquiry Reference Number</p>
            <p className="text-2xl font-mono font-bold text-brand-primary">{referenceNumber}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href={`https://wa.me/971500000000?text=${encodeURIComponent('Hello AZM Group, I have just submitted an inquiry on your website.\n\nReference Number: *' + referenceNumber + '*\nPlease let me know when my quotation will be ready.')}`}
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 bg-[#25D366] text-white rounded-lg font-bold uppercase tracking-wider hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} /> Send via WhatsApp
            </a>
            <Link to="/products" className="px-8 py-4 bg-brand-primary text-white rounded-lg font-bold uppercase tracking-wider hover:bg-brand-secondary transition-colors text-center">
              Continue Browsing
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col bg-stone-50 pb-20">
      <SEO title="Inquiry List | AZM Group" description="Manage your selected products and submit a bulk quotation request to AZM Group." />
      
      <div className="bg-brand-secondary py-16 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Your Inquiry List</h1>
        <p className="text-stone-300 max-w-2xl mx-auto px-4">Review your selected products, adjust quantities, and submit your project requirements for a comprehensive quotation.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full" ref={printRef}>
        
        {items.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-stone-200 text-center max-w-2xl mx-auto">
            <FileText size={64} className="mx-auto text-stone-300 mb-6" />
            <h2 className="text-2xl font-bold text-brand-secondary mb-4">Your Inquiry List is Empty</h2>
            <p className="text-stone-500 mb-8">You haven't added any products to your inquiry list yet. Browse our catalogue to add items.</p>
            <Link to="/products" className="inline-flex items-center justify-center px-8 py-4 bg-brand-primary text-white rounded-lg font-bold uppercase tracking-wider hover:bg-brand-secondary transition-colors">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            
            {/* LEFT: Product List */}
            <div className="w-full lg:w-3/5 xl:w-2/3">
              <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden mb-6">
                <div className="p-6 border-b border-stone-200 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-brand-secondary">Selected Products ({itemCount})</h2>
                  <div className="flex gap-2">
                    <button onClick={handlePrint} className="p-2 text-stone-500 hover:text-brand-primary transition-colors tooltip-trigger" title="Print Inquiry">
                      <Printer size={20} />
                    </button>
                    <button onClick={handleDownloadCSV} className="p-2 text-stone-500 hover:text-brand-primary transition-colors tooltip-trigger" title="Download CSV">
                      <Download size={20} />
                    </button>
                    <a 
                      href={`https://wa.me/971500000000?text=${encodeURIComponent(generateWhatsAppMessage())}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 text-[#25D366] hover:text-[#128C7E] transition-colors tooltip-trigger" 
                      title="Send via WhatsApp"
                    >
                      <MessageCircle size={20} />
                    </a>
                  </div>
                </div>
                
                <div className="divide-y divide-stone-200 print-friendly-list">
                  {items.map(item => (
                    <div key={item.product.id} className="p-6 flex flex-col sm:flex-row gap-6">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 bg-stone-50 rounded-lg flex-shrink-0 flex items-center justify-center border border-stone-100 overflow-hidden relative">
                        <OptimizedImage 
                          src={item.product.thumbnail || item.product.images?.[0] || 'https://placehold.co/200'} 
                          alt={item.product.name}
                          className="w-full h-full object-contain mix-blend-multiply p-2"
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            {item.product.brand && (
                              <span className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-1 block">
                                {item.product.brand}
                              </span>
                            )}
                            <h3 className="font-bold text-lg text-brand-secondary leading-tight mb-1">
                              <Link to={`/products/${item.product.sku}`} className="hover:text-brand-primary transition-colors">
                                {item.product.name}
                              </Link>
                            </h3>
                            <p className="text-xs font-mono text-stone-500">SKU: {item.product.sku}</p>
                          </div>
                          <button 
                            onClick={() => removeItem(item.product.id)}
                            className="text-stone-400 hover:text-red-500 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Quantity & Unit</label>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50 overflow-hidden h-10 w-32">
                                <button 
                                  onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                                  className="w-10 h-full flex items-center justify-center text-stone-500 hover:bg-stone-200 transition-colors"
                                >
                                  <Minus size={14} />
                                </button>
                                <input 
                                  type="number" 
                                  value={item.quantity}
                                  onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 1)}
                                  className="w-full h-full bg-transparent text-center font-bold text-brand-secondary focus:outline-none appearance-none"
                                  min="1"
                                />
                                <button 
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  className="w-10 h-full flex items-center justify-center text-stone-500 hover:bg-stone-200 transition-colors"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                              <select 
                                value={item.unit}
                                onChange={(e) => updateUnit(item.product.id, e.target.value)}
                                className="h-10 border border-stone-200 rounded-lg bg-stone-50 text-sm font-bold text-stone-700 px-3 focus:outline-none focus:border-brand-primary"
                              >
                                <option value="PCS">PCS</option>
                                <option value="SQM">SQM</option>
                                <option value="LM">LM</option>
                                <option value="SET">SET</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Product Notes (Optional)</label>
                            <input 
                              type="text"
                              value={item.notes}
                              onChange={(e) => updateNotes(item.product.id, e.target.value)}
                              placeholder="e.g. required in Matte Black"
                              className="w-full h-10 border border-stone-200 rounded-lg bg-stone-50 text-sm px-3 focus:outline-none focus:border-brand-primary focus:bg-white transition-colors"
                            />
                          </div>
                        </div>
                        
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-blue-800 text-sm">
                <MessageCircle className="flex-shrink-0 mt-0.5" size={18} />
                <p>Your inquiry is saved automatically in your browser. You can safely browse more products and return here to complete your request.</p>
              </div>
            </div>

            {/* RIGHT: Inquiry Form */}
            <div className="w-full lg:w-2/5 xl:w-1/3">
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden sticky top-24 print-hidden">
                <div className="bg-stone-900 p-6">
                  <h2 className="text-xl font-bold text-white mb-2">Submit Requirements</h2>
                  <p className="text-stone-400 text-sm">Fill your details below to receive a formal quotation for the selected products.</p>
                </div>
                
                <div className="p-6 space-y-5">
                  <input type="text" name="website_url" className="hidden" tabIndex={-1} autoComplete="off" />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">First Name *</label>
                      <input required type="text" name="firstName" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary focus:bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Last Name *</label>
                      <input required type="text" name="lastName" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary focus:bg-white" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Company Name *</label>
                    <input required type="text" name="companyName" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary focus:bg-white" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Customer Type *</label>
                      <select required name="customerType" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary focus:bg-white">
                        <option value="">Select...</option>
                        <option value="Contractor">Contractor</option>
                        <option value="Consultant/Architect">Consultant/Architect</option>
                        <option value="Interior Designer">Interior Designer</option>
                        <option value="Developer">Developer</option>
                        <option value="Homeowner">Homeowner</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Project Type</label>
                      <select name="projectType" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary focus:bg-white">
                        <option value="">Select...</option>
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Hospitality">Hospitality</option>
                        <option value="Healthcare">Healthcare</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Project Name</label>
                      <input type="text" name="projectName" placeholder="e.g. Palm Jumeirah Villa" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary focus:bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Project Location</label>
                      <input type="text" name="projectLocation" placeholder="e.g. Dubai" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary focus:bg-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Email *</label>
                      <input required type="email" name="email" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary focus:bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Telephone *</label>
                      <input required type="tel" name="phone" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary focus:bg-white" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">WhatsApp Number</label>
                      <input type="tel" name="whatsapp" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary focus:bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Preferred Contact Method</label>
                      <select name="preferredContact" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary focus:bg-white">
                        <option value="Email">Email</option>
                        <option value="Phone">Phone</option>
                        <option value="WhatsApp">WhatsApp</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Emirate/City *</label>
                      <input required type="text" name="emirate" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary focus:bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Country *</label>
                      <input required type="text" name="country" defaultValue="United Arab Emirates" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary focus:bg-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Est. Requirement Date</label>
                      <input type="date" name="requirementDate" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary focus:bg-white" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Additional Requirements</label>
                    <textarea name="message" rows={3} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary focus:bg-white resize-none" placeholder="Any special instructions or timeline..."></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Attachment (Optional)</label>
                    <input type="file" name="attachment" className="w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-stone-100 file:text-brand-secondary hover:file:bg-stone-200 transition-colors" accept=".pdf,.doc,.docx,.jpg,.png,.dwg" />
                    <p className="text-[10px] text-stone-400 mt-1">Max 5MB. PDF, DOCX, JPG, PNG, DWG</p>
                  </div>

                  <div className="flex items-start gap-2 pt-2">
                    <input required type="checkbox" id="privacy" className="mt-1" />
                    <label htmlFor="privacy" className="text-xs text-stone-500 leading-relaxed">
                      I consent to my data being processed in accordance with the Privacy Policy for the purpose of receiving this quotation.
                    </label>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-brand-primary text-white py-4 rounded-xl font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 hover:bg-brand-secondary transition-colors mt-6 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Send size={18} />
                        Submit Request
                      </>
                    )}
                  </button>
                  
                  <p className="text-center text-[10px] text-stone-400 uppercase tracking-wider mt-4">
                    Secure submission via SSL
                  </p>
                </div>
              </form>
            </div>
            
          </div>
        )}
      </div>
      
      <style>{`
        @media print {
          .print-hidden { display: none !important; }
          .print-friendly-list { border-top: 1px solid #e5e7eb; }
          body { background: white; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>
    </div>
  );
}
