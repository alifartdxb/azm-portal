import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { OptimizedImage } from '../components/OptimizedImage';
import { InquiryModal } from '../components/InquiryModal';
import { getProductBySlug, getBrandBySlug, getCategoryById, PRODUCTS_DATA, BRANDS_DATA, CATEGORIES_DATA } from '../data';
import { Phone, ArrowLeft, ChevronRight, FileText, MessageSquare, Mail, Download, Ruler, Settings, CheckCircle2, Shield, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import { getCollection } from '../services/db';

import { NotFoundPage } from './NotFoundPage';

export function ProductDetail() {
  const { brandSlug, categorySlug, productSlug, sku } = useParams<{ brandSlug?: string, categorySlug?: string, productSlug?: string, sku?: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const imagesList = product?.images && product.images.length > 0 ? product.images : (product?.mainImage ? [product.mainImage] : ['https://placehold.co/400']);
  const [activeImage, setActiveImage] = useState(0);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const products = await getCollection('products') as any[];
        
        // Find product by slug or sku
        let foundProduct = null;
        if (productSlug) {
          foundProduct = products.find(p => p.urlSlug === productSlug || p.slug === productSlug || p.sku === productSlug);
        }
        if (!foundProduct && sku) {
          foundProduct = products.find(p => p.sku === sku);
        }

        if (foundProduct && foundProduct.status !== 'Draft') {
          setProduct(foundProduct);
        } else {
          // Fallback to static data
          const fallbackProduct = productSlug 
            ? getProductBySlug(productSlug) 
            : (sku ? PRODUCTS_DATA.find(p => p.sku === sku) : undefined);
          setProduct(fallbackProduct);
        }
      } catch (e) {
        console.error("Failed to fetch product", e);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productSlug, sku]);

  

  const [dbBrand, setDbBrand] = useState<any>(null);
  const [dbCategory, setDbCategory] = useState<any>(null);

  useEffect(() => {
    async function loadBrandAndCat() {
      if (!product) return;
      try {
        const brands = await getCollection('brands');
        const categories = await getCollection('categories');
        setDbBrand(brands.find((b:any) => b.id === product.brandId || b.name === product.brand) || BRANDS_DATA.find(b => b.id === product.brandId || b.name === product.brand));
        setDbCategory(categories.find((c:any) => c.id === product.categoryId || c.name === product.category) || CATEGORIES_DATA.find(c => c.id === product.categoryId || c.name === product.category));
      } catch (e) {
        setDbBrand(BRANDS_DATA.find(b => b.id === product.brandId || b.name === product.brand));
        setDbCategory(CATEGORIES_DATA.find(c => c.id === product.categoryId || c.name === product.category));
      }
    }
    loadBrandAndCat();
  }, [product]);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-stone-200 border-t-brand-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return <NotFoundPage />;
  }


  const brand: any = dbBrand || { name: product?.brand || '', slug: product?.brand?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'brand' };
  const category = dbCategory || { name: product?.category || '', slug: product?.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'category' };

  // Safely extract images
  const images = [];
  if (product.mainImage) images.push(product.mainImage);
  if (product.images && Array.isArray(product.images)) {
    product.images.forEach((img: string) => {
      if (!images.includes(img)) images.push(img);
    });
  }
  if (product.galleryImages && Array.isArray(product.galleryImages)) {
    product.galleryImages.forEach((img: string) => {
      if (!images.includes(img)) images.push(img);
    });
  }
  if (images.length === 0) {
    images.push('https://placehold.co/800x800?text=No+Image');
  }

  const schemas = [
    {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "image": images,
      "description": product.fullDescription || product.description,
      "sku": product.sku,
      "brand": {
        "@type": "Brand",
        "name": brand?.name || product.brand || "Unknown Brand"
      }
    }
  ];

  return (
    <div className="flex-grow flex flex-col bg-white">
      <SEO 
        title={product.seoTitle || product.name}
        description={product.metaDescription || product.shortDescription || product.seoDescription}
        keywords={[product.name, product.sku, brand?.name || '', category?.name || '', "Dubai", "UAE"]}
        schemas={schemas}
      />

      <div className="pt-24 pb-4 border-b border-stone-100 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex text-xs font-bold uppercase tracking-wider text-stone-500 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-brand-primary transition-colors">Home</Link>
            <ChevronRight size={14} className="mx-2" />
            <Link to="/brands" className="hover:text-brand-primary transition-colors">Brands</Link>
            {brand && (
              <>
                <ChevronRight size={14} className="mx-2" />
                <Link to={`/brands/${brand.slug || brand.name.toLowerCase()}`} className="hover:text-brand-primary transition-colors">{brand.name}</Link>
              </>
            )}
            <ChevronRight size={14} className="mx-2" />
            <span className="text-brand-secondary">{product.sku}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-stone-50 rounded-2xl border border-stone-200 overflow-hidden relative">
              <OptimizedImage 
                src={images[activeImage]} 
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply p-8"
              />
              {brand && brand.logo && (
                <div className="absolute top-6 left-6">
                  <OptimizedImage src={brand.logo} alt={brand.name} className="h-8 w-auto mix-blend-multiply opacity-50" fallbackSrc={`https://via.placeholder.com/150x50?text=${brand.name}`} />
                </div>
              )}
            </div>
            
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`aspect-square bg-stone-50 rounded-xl border-2 overflow-hidden ${activeImage === idx ? 'border-brand-primary' : 'border-transparent hover:border-stone-300'} transition-all`}
                  >
                    <OptimizedImage src={img} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover mix-blend-multiply" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <Link to={`/brands/${brand?.slug || (brand?.name || product.brand || '').toLowerCase()}`} className="text-sm font-bold uppercase tracking-widest text-brand-primary hover:underline mb-2 block">
                  {brand?.name || product.brand}
                </Link>
                <h1 className="text-3xl md:text-5xl font-bold font-display text-brand-secondary mb-2">{product.name}</h1>
                <div className="flex items-center gap-3 text-sm font-mono text-stone-500 bg-stone-100 px-3 py-1 rounded inline-block">
                  SKU: {product.sku}
                </div>
              </div>
              <button className="w-10 h-10 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-400 hover:text-brand-primary hover:border-brand-primary transition-colors tooltip" aria-label="Share">
                <Share2 size={18} />
              </button>
            </div>

            <p className="text-lg text-stone-600 leading-relaxed mb-8">
              {product.fullDescription || product.shortDescription || product.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                <span className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Collection</span>
                <span className="font-bold text-brand-secondary">{product.collection || 'Standard'}</span>
              </div>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                <span className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Status</span>
                <span className={`font-bold ${product.status === 'Available' ? 'text-green-600' : 'text-orange-500'}`}>{product.status || 'Available'}</span>
              </div>
            </div>

            {/* Finishes */}
            {product.finish && (
              <div className="mb-10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 mb-4">Available Finishes</h3>
                <div className="flex flex-wrap gap-3">
                  {Array.isArray(product.finish) ? product.finish.map((f: string) => (
                    <div key={f} className="px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-stone-700 shadow-sm">
                      {f}
                    </div>
                  )) : (
                    <div className="px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-stone-700 shadow-sm">
                      {product.finish}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 mb-12">
              <button onClick={() => setIsInquiryModalOpen(true)} className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-brand-secondary transition-colors shadow-lg hover:shadow-xl">
                Request a Quote <FileText size={18} />
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button onClick={() => setIsInquiryModalOpen(true)} className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-green-600 transition-colors shadow-lg">
                  WhatsApp Inquiry <MessageSquare size={18} />
                </button>
                <a href="tel:+97142844452" className="w-full flex items-center justify-center gap-2 bg-stone-800 text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-stone-900 transition-colors shadow-lg">
                  Call Now <Phone size={18} />
                </a>
              </div>
              <button onClick={() => setIsInquiryModalOpen(true)} className="w-full flex items-center justify-center gap-2 bg-stone-100 text-stone-800 border border-stone-200 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-stone-200 transition-colors">
                  Email Inquiry <Mail size={18} />
              </button>
            </div>

            {/* Downloads */}
            {(product.cataloguePdf || product.technicalSheet || product.installationGuide || product.warrantyPdf || (product.documents && product.documents.length > 0)) && (
              <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100">
                <h3 className="font-bold text-lg text-brand-secondary mb-4 flex items-center gap-2"><Download size={20} className="text-brand-primary" /> Technical Documents</h3>
                <div className="space-y-3">
                  {product.cataloguePdf && (
                    <a href={product.cataloguePdf} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-white border border-stone-200 rounded-xl hover:border-brand-primary group transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText size={18} className="text-stone-400 group-hover:text-brand-primary transition-colors" />
                        <span className="font-medium text-sm text-stone-700">Catalogue</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary bg-brand-primary/10 px-2 py-1 rounded">Download PDF</span>
                    </a>
                  )}
                  {product.technicalSheet && (
                    <a href={product.technicalSheet} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-white border border-stone-200 rounded-xl hover:border-brand-primary group transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText size={18} className="text-stone-400 group-hover:text-brand-primary transition-colors" />
                        <span className="font-medium text-sm text-stone-700">Technical Sheet</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary bg-brand-primary/10 px-2 py-1 rounded">Download PDF</span>
                    </a>
                  )}
                  {product.installationGuide && (
                    <a href={product.installationGuide} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-white border border-stone-200 rounded-xl hover:border-brand-primary group transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText size={18} className="text-stone-400 group-hover:text-brand-primary transition-colors" />
                        <span className="font-medium text-sm text-stone-700">Installation Guide</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary bg-brand-primary/10 px-2 py-1 rounded">Download PDF</span>
                    </a>
                  )}
                  {product.documents?.map((doc: any) => (
                    <a key={doc.id || doc.url} href={doc.url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-white border border-stone-200 rounded-xl hover:border-brand-primary group transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText size={18} className="text-stone-400 group-hover:text-brand-primary transition-colors" />
                        <span className="font-medium text-sm text-stone-700">{doc.title}</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary bg-brand-primary/10 px-2 py-1 rounded">Download PDF</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>

      {/* Tabs / Detailed Specs */}
      <div className="bg-stone-50 border-y border-stone-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <CheckCircle2 size={20} />
                </div>
                <h3 className="text-xl font-bold font-display text-brand-secondary">Key Features</h3>
              </div>
              <ul className="space-y-3">
                {product.features ? (
                  typeof product.features === 'string' 
                    ? product.features.split('\n').map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 flex-shrink-0" />
                          <span className="text-stone-600 leading-relaxed text-sm">{feature.replace(/^- /, '')}</span>
                        </li>
                      ))
                    : product.features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 flex-shrink-0" />
                          <span className="text-stone-600 leading-relaxed text-sm">{feature}</span>
                        </li>
                      ))
                ) : (
                  <li className="text-stone-500 text-sm">No specific features listed.</li>
                )}
              </ul>
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <Settings size={20} />
                </div>
                <h3 className="text-xl font-bold font-display text-brand-secondary">Specifications</h3>
              </div>
              <dl className="space-y-4">
                <div className="grid grid-cols-3 gap-4 border-b border-stone-200 pb-2">
                  <dt className="text-xs font-bold uppercase tracking-wider text-stone-500">Material</dt>
                  <dd className="col-span-2 text-sm font-medium text-stone-800">{product.material || '-'}</dd>
                </div>
                {product.installationType && (
                  <div className="grid grid-cols-3 gap-4 border-b border-stone-200 pb-2">
                    <dt className="text-xs font-bold uppercase tracking-wider text-stone-500">Installation</dt>
                    <dd className="col-span-2 text-sm font-medium text-stone-800">{Array.isArray(product.installationType) ? product.installationType.join(', ') : product.installationType}</dd>
                  </div>
                )}
                {product.application && (
                  <div className="grid grid-cols-3 gap-4 border-b border-stone-200 pb-2">
                    <dt className="text-xs font-bold uppercase tracking-wider text-stone-500">Application</dt>
                    <dd className="col-span-2 text-sm font-medium text-stone-800">{Array.isArray(product.application) ? product.application.join(', ') : product.application}</dd>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-4 pb-2">
                  <dt className="text-xs font-bold uppercase tracking-wider text-stone-500">Tech Specs</dt>
                  <dd className="col-span-2 text-sm font-medium text-stone-800">{product.technicalSpec || product.technicalSpecifications || '-'}</dd>
                </div>
              </dl>
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <Ruler size={20} />
                </div>
                <h3 className="text-xl font-bold font-display text-brand-secondary">Dimensions & Setup</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm mb-6">
                <p className="text-sm font-bold text-stone-900 mb-2">Overall Dimensions</p>
                <p className="text-stone-600 font-mono text-sm">{product.dimensions || '-'}</p>
                <div className="my-4 border-t border-stone-100" />
                <p className="text-sm font-bold text-stone-900 mb-2">Weight</p>
                <p className="text-stone-600 font-mono text-sm">{product.weight || '-'}</p>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-brand-secondary text-white rounded-xl">
                <Shield size={24} className="text-brand-primary flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Warranty</p>
                  <p className="font-bold">{product.warranty || '-'}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <InquiryModal 
        isOpen={isInquiryModalOpen} 
        onClose={() => setIsInquiryModalOpen(false)} 
        product={{
          name: product.name,
          sku: product.sku,
          brand: brand?.name || product.brand || '',
          category: category?.name || product.category || ''
        }}
      />
    </div>
  );
}