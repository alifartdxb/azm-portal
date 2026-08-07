import { useInquiry } from '../contexts/InquiryContext';
import React from "react";
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { OptimizedImage } from '../components/OptimizedImage';
import { getProductBySlug, getRelatedProducts } from '../services/productService';
import { getCollection } from '../services/db';
import { 
  ArrowRight, FileText, ChevronRight, MessageCircle, MapPin, 
  CheckCircle2, Share2, Printer, Download, Ruler, Settings, Shield,
  PlayCircle, Box, AlertCircle, Info, Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function ProductDetail() {
  const { productSlug, categorySlug, brandSlug } = useParams<{ productSlug: string, categorySlug?: string, brandSlug?: string }>();
  const { addItem, items } = useInquiry();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isRtl = searchParams.get('lang') === 'ar';
  
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mediaTab, setMediaTab] = useState<'image' | 'video' | '360'>('image');
  
  const [dbBrands, setDbBrands] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [bData, cData] = await Promise.all([
          getCollection('brands'),
          getCollection('categories')
        ]);
        setDbBrands(bData);
        setDbCategories(cData);
        
        if (productSlug) {
          const p = await getProductBySlug(productSlug);
          if (p) {
            setProduct(p);
            const related = await getRelatedProducts(p);
            setRelatedProducts(related);
            setActiveImageIndex(0);
            setMediaTab('image');
          } else {
            setError('Product not found');
          }
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
    window.scrollTo(0, 0);
  }, [productSlug]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[60vh] bg-stone-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-stone-500 font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[60vh] bg-stone-50">
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-stone-200 text-center max-w-md">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-6" />
          <h2 className="text-2xl font-bold font-display text-brand-secondary mb-2">Product Not Found</h2>
          <p className="text-stone-500 mb-8">The product you are looking for does not exist or has been removed.</p>
          <Link to="/products" className="inline-flex items-center justify-center px-6 py-3 bg-brand-primary text-white rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-brand-secondary transition-colors w-full">
            Browse All Products
          </Link>
        </div>
      </div>
    );
  }

  const brand = dbBrands.find((b: any) => b.id === product.brandId || b.name === product.brand);
  const category = dbCategories.find((c: any) => c.id === product.categoryId || c.name === product.category);
  
  const productName = isRtl && product.nameAr ? product.nameAr : product.name;
  const productDesc = isRtl && product.descriptionAr ? product.descriptionAr : (product.description || product.shortDescription);
  const brandName = brand ? (isRtl && brand.nameAr ? brand.nameAr : brand.name) : product.brand;
  const categoryName = category ? (isRtl && category.nameAr ? category.nameAr : category.name) : product.category;

  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const waMessage = `Hello AZM, I am interested in ${product.name}, SKU ${product.sku}, by ${brand?.name || product.brand}. Please share availability, specifications and quotation. Product link: ${pageUrl}`;
  const waUrl = `https://wa.me/971500000000?text=${encodeURIComponent(waMessage)}`;

  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail || 'https://placehold.co/800'];
  const mainImage = images[activeImageIndex];

  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": images,
    "description": product.shortDescription || product.description,
    "sku": product.sku,
    "mpn": product.modelNumber || product.sku,
    "brand": {
      "@type": "Brand",
      "name": brand?.name || product.brand
    }
  };

  const hasVideo = !!product.videoUrl;
  const has360 = !!product.media360Url;

  return (
    <div className={`flex-grow flex flex-col bg-white pb-20 ${isRtl ? 'font-arabic text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <SEO 
        title={`${productName} | ${brandName} | AZM Group`}
        description={product.shortDescription || product.description || `Buy ${productName} by ${brandName} from AZM Group.`}
        schemas={[schema]}
      />

      {/* Breadcrumbs */}
      <div className="bg-stone-50 border-b border-stone-200 pt-24 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center text-xs font-semibold text-stone-500 tracking-wider uppercase">
            <Link to="/" className="hover:text-brand-primary flex items-center gap-1"><Home size={14} /> {isRtl ? 'الرئيسية' : 'Home'}</Link>
            <ChevronRight size={14} className={`mx-2 ${isRtl ? 'rotate-180' : ''}`} />
            <Link to="/products" className="hover:text-brand-primary">{isRtl ? 'المنتجات' : 'Products'}</Link>
            {category && (
              <>
                <ChevronRight size={14} className={`mx-2 ${isRtl ? 'rotate-180' : ''}`} />
                <Link to={`/products?category=${category.id}`} className="hover:text-brand-primary">{categoryName}</Link>
              </>
            )}
            <ChevronRight size={14} className={`mx-2 ${isRtl ? 'rotate-180' : ''}`} />
            <span className="text-stone-900 truncate max-w-[200px] sm:max-w-none">{productName}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* LEFT: Media Gallery */}
          <div className="w-full lg:w-1/2">
            
            {/* Media Tabs */}
            <div className="flex items-center gap-2 mb-4">
              <button 
                onClick={() => setMediaTab('image')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${mediaTab === 'image' ? 'bg-brand-primary text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
              >
                <ArrowRight size={16} className={`hidden`} />
                {isRtl ? 'الصور' : 'Images'}
              </button>
              {hasVideo && (
                <button 
                  onClick={() => setMediaTab('video')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${mediaTab === 'video' ? 'bg-brand-primary text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
                >
                  <PlayCircle size={16} />
                  {isRtl ? 'فيديو' : 'Video'}
                </button>
              )}
              {has360 && (
                <button 
                  onClick={() => setMediaTab('360')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${mediaTab === '360' ? 'bg-brand-primary text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
                >
                  <Box size={16} />
                  {isRtl ? 'عرض 360' : '360° View'}
                </button>
              )}
            </div>

            {/* Main Display Area */}
            <div className="relative aspect-square bg-stone-50 rounded-2xl border border-stone-200 overflow-hidden flex items-center justify-center group mb-4">
              
              {mediaTab === 'image' && (
                <div 
                  className="w-full h-full relative cursor-zoom-in"
                  onMouseEnter={() => setIsZoomed(true)}
                  onMouseLeave={() => setIsZoomed(false)}
                  onMouseMove={handleMouseMove}
                >
                  <OptimizedImage 
                    src={mainImage}
                    alt={product.name}
                    className={`w-full h-full object-contain mix-blend-multiply transition-opacity duration-300 ${isZoomed ? 'opacity-0' : 'opacity-100'}`}
                  />
                  {isZoomed && (
                    <div 
                      className="absolute inset-0 bg-no-repeat z-10 mix-blend-multiply"
                      style={{
                        backgroundImage: `url(${mainImage})`,
                        backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                        backgroundSize: '200%' // 2x zoom
                      }}
                    />
                  )}
                </div>
              )}

              {mediaTab === 'video' && product.videoUrl && (
                <iframe 
                  src={product.videoUrl} 
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              )}

              {mediaTab === '360' && product.media360Url && (
                <iframe 
                  src={product.media360Url} 
                  className="w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              )}
            </div>

            {/* Thumbnails */}
            {mediaTab === 'image' && images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {images.map((img: string, idx: number) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`aspect-square rounded-lg border-2 overflow-hidden bg-stone-50 transition-colors ${activeImageIndex === idx ? 'border-brand-primary' : 'border-transparent hover:border-stone-300'}`}
                  >
                    <OptimizedImage 
                      src={img} 
                      alt={`${product.name} thumbnail ${idx + 1}`} 
                      className="w-full h-full object-contain mix-blend-multiply p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Info */}
          <div className="w-full lg:w-1/2 flex flex-col">
            
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {brand && (
                <Link to={`/brands/${brand.slug}`} className="bg-stone-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-brand-secondary hover:bg-stone-200 transition-colors">
                  {brandName}
                </Link>
              )}
              {product.collection && (
                <span className="bg-stone-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-stone-500">
                  {isRtl ? 'مجموعة:' : 'Collection:'} {product.collection}
                </span>
              )}
              {product.status && (
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  product.status === 'Available' ? 'bg-green-100 text-green-800' :
                  product.status === 'Check Availability' ? 'bg-amber-100 text-amber-800' :
                  product.status === 'Discontinued' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800' // On Request, Project Order
                }`}>
                  {product.status}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-brand-secondary mb-2 leading-tight">
              {productName}
            </h1>
            
            <div className="flex items-center gap-4 text-sm font-mono text-stone-500 mb-6 pb-6 border-b border-stone-200">
              <p>SKU: <span className="text-stone-900">{product.sku}</span></p>
              {product.modelNumber && (
                <>
                  <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                  <p>{isRtl ? 'موديل:' : 'Model:'} <span className="text-stone-900">{product.modelNumber}</span></p>
                </>
              )}
            </div>

            <p className="text-stone-600 text-lg leading-relaxed mb-8">
              {productDesc}
            </p>

            {/* Actions / CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button 
                onClick={() => addItem(product)}
                className="flex-1 bg-brand-primary text-white py-4 px-6 rounded-xl font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 hover:bg-brand-secondary transition-colors text-center"
              >
                <FileText size={18} />
                {isRtl ? 'أضف إلى القائمة' : (items.some((i: any) => i.product.id === product.id) ? 'Add More' : 'Add to Inquiry')}
              </button>
              <a 
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-[#25D366] text-white py-4 px-6 rounded-xl font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 hover:bg-[#128C7E] transition-colors text-center"
              >
                <MessageCircle size={18} />
                {isRtl ? 'واتساب' : 'WhatsApp'}
              </a>
            </div>

            {/* Minor Actions */}
            <div className="flex flex-wrap items-center gap-4 mb-10 text-sm font-bold text-stone-500">
              <Link to="/contact?tab=visit" className="flex items-center gap-1.5 hover:text-brand-primary transition-colors">
                <MapPin size={16} /> {isRtl ? 'حجز زيارة للمعرض' : 'Book Showroom Visit'}
              </Link>
              <button onClick={() => window.print()} className="flex items-center gap-1.5 hover:text-brand-primary transition-colors">
                <Printer size={16} /> {isRtl ? 'طباعة' : 'Print'}
              </button>
              <button onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: product.name, url: window.location.href });
                }
              }} className="flex items-center gap-1.5 hover:text-brand-primary transition-colors">
                <Share2 size={16} /> {isRtl ? 'مشاركة' : 'Share'}
              </button>
            </div>

            {/* Quick Specs Grid */}
            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200">
              <h3 className="font-bold text-sm uppercase tracking-wider text-brand-secondary mb-4 pb-4 border-b border-stone-200">
                {isRtl ? 'مواصفات سريعة' : 'Quick Specifications'}
              </h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                {product.material && (
                  <div>
                    <span className="block text-stone-500 text-xs uppercase tracking-wider mb-1">{isRtl ? 'المادة' : 'Material'}</span>
                    <span className="font-semibold text-stone-900">{product.material}</span>
                  </div>
                )}
                {product.finish && (
                  <div>
                    <span className="block text-stone-500 text-xs uppercase tracking-wider mb-1">{isRtl ? 'التشطيب' : 'Finish'}</span>
                    <span className="font-semibold text-stone-900">{Array.isArray(product.finish) ? product.finish.join(', ') : product.finish}</span>
                  </div>
                )}
                {product.sizes && (
                  <div>
                    <span className="block text-stone-500 text-xs uppercase tracking-wider mb-1">{isRtl ? 'المقاسات' : 'Sizes'}</span>
                    <span className="font-semibold text-stone-900">{Array.isArray(product.sizes) ? product.sizes.join(', ') : product.sizes}</span>
                  </div>
                )}
                {product.colors && (
                  <div>
                    <span className="block text-stone-500 text-xs uppercase tracking-wider mb-1">{isRtl ? 'الألوان' : 'Colours'}</span>
                    <span className="font-semibold text-stone-900">{Array.isArray(product.colors) ? product.colors.join(', ') : product.colors}</span>
                  </div>
                )}
                {product.countryOfOrigin && (
                  <div>
                    <span className="block text-stone-500 text-xs uppercase tracking-wider mb-1">{isRtl ? 'بلد المنشأ' : 'Country of Origin'}</span>
                    <span className="font-semibold text-stone-900">{product.countryOfOrigin}</span>
                  </div>
                )}
                {product.warranty && (
                  <div>
                    <span className="block text-stone-500 text-xs uppercase tracking-wider mb-1">{isRtl ? 'الضمان' : 'Warranty'}</span>
                    <span className="font-semibold text-stone-900">{product.warranty}</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Tabs / Detailed Specs */}
      <div className="bg-stone-50 border-y border-stone-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            {/* Key Features */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <CheckCircle2 size={20} />
                </div>
                <h3 className="text-xl font-bold font-display text-brand-secondary">{isRtl ? 'الميزات الرئيسية' : 'Key Features'}</h3>
              </div>
              <ul className="space-y-3">
                {product.features || product.featuresAr ? (
                  (isRtl && product.featuresAr ? product.featuresAr : product.features)
                  .toString().split('\n').map((feature: string, idx: number) => {
                    if(!feature.trim()) return null;
                    return (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 flex-shrink-0" />
                        <span className="text-stone-600 leading-relaxed text-sm">{feature.replace(/^- /, '')}</span>
                      </li>
                    )
                  })
                ) : (
                  <li className="text-stone-500 text-sm">{isRtl ? 'لا توجد ميزات مدرجة.' : 'No specific features listed.'}</li>
                )}
              </ul>
            </div>
            
            {/* Technical Specifications */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <Settings size={20} />
                </div>
                <h3 className="text-xl font-bold font-display text-brand-secondary">{isRtl ? 'المواصفات' : 'Specifications'}</h3>
              </div>
              <dl className="space-y-4">
                {product.installationType && (
                  <div className="grid grid-cols-3 gap-4 border-b border-stone-200 pb-2">
                    <dt className="text-xs font-bold uppercase tracking-wider text-stone-500">{isRtl ? 'التركيب' : 'Installation'}</dt>
                    <dd className="col-span-2 text-sm font-medium text-stone-800">{Array.isArray(product.installationType) ? product.installationType.join(', ') : product.installationType}</dd>
                  </div>
                )}
                {product.application && (
                  <div className="grid grid-cols-3 gap-4 border-b border-stone-200 pb-2">
                    <dt className="text-xs font-bold uppercase tracking-wider text-stone-500">{isRtl ? 'الاستخدام' : 'Application'}</dt>
                    <dd className="col-span-2 text-sm font-medium text-stone-800">{Array.isArray(product.application) ? product.application.join(', ') : product.application}</dd>
                  </div>
                )}
                {(product.technicalSpec || product.technicalSpecAr) && (
                  <div className="grid grid-cols-3 gap-4 pb-2">
                    <dt className="text-xs font-bold uppercase tracking-wider text-stone-500">{isRtl ? 'مواصفات فنية' : 'Tech Specs'}</dt>
                    <dd className="col-span-2 text-sm font-medium text-stone-800">{isRtl && product.technicalSpecAr ? product.technicalSpecAr : product.technicalSpec}</dd>
                  </div>
                )}
                {product.certifications && (
                  <div className="grid grid-cols-3 gap-4 border-t border-stone-200 pt-2 pb-2">
                    <dt className="text-xs font-bold uppercase tracking-wider text-stone-500">{isRtl ? 'الشهادات' : 'Certificates'}</dt>
                    <dd className="col-span-2 text-sm font-medium text-stone-800">{Array.isArray(product.certifications) ? product.certifications.join(', ') : product.certifications}</dd>
                  </div>
                )}
              </dl>
            </div>
            
            {/* Downloads & Dimensions */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <Download size={20} />
                </div>
                <h3 className="text-xl font-bold font-display text-brand-secondary">{isRtl ? 'التحميلات' : 'Downloads'}</h3>
              </div>
              
              <div className="space-y-3 mb-8">
                {product.technicalSheetUrl && (
                  <a href={product.technicalSheetUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-white border border-stone-200 rounded-xl hover:border-brand-primary group transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-stone-400 group-hover:text-brand-primary transition-colors" />
                      <span className="font-bold text-sm text-brand-secondary">{isRtl ? 'ورقة البيانات الفنية' : 'Technical Data Sheet'}</span>
                    </div>
                    <Download size={16} className="text-stone-400 group-hover:text-brand-primary" />
                  </a>
                )}
                {product.installationGuideUrl && (
                  <a href={product.installationGuideUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-white border border-stone-200 rounded-xl hover:border-brand-primary group transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-stone-400 group-hover:text-brand-primary transition-colors" />
                      <span className="font-bold text-sm text-brand-secondary">{isRtl ? 'دليل التركيب' : 'Installation Guide'}</span>
                    </div>
                    <Download size={16} className="text-stone-400 group-hover:text-brand-primary" />
                  </a>
                )}
                {product.catalogueUrl && (
                  <a href={product.catalogueUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-white border border-stone-200 rounded-xl hover:border-brand-primary group transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-stone-400 group-hover:text-brand-primary transition-colors" />
                      <span className="font-bold text-sm text-brand-secondary">{isRtl ? 'كتالوج المنتجات' : 'Product Catalogue'}</span>
                    </div>
                    <Download size={16} className="text-stone-400 group-hover:text-brand-primary" />
                  </a>
                )}
                {!product.technicalSheetUrl && !product.installationGuideUrl && !product.catalogueUrl && (
                  <p className="text-stone-500 text-sm">{isRtl ? 'لا توجد تحميلات متوفرة.' : 'No downloads available.'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      {product.faqs && product.faqs.length > 0 && (
        <div className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold font-display text-brand-secondary mb-8 text-center">
              {isRtl ? 'الأسئلة الشائعة' : 'Product FAQs'}
            </h2>
            <div className="space-y-4">
              {product.faqs.map((faq: any, idx: number) => (
                <details key={idx} className="group bg-stone-50 border border-stone-200 rounded-xl">
                  <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-brand-secondary">
                    {isRtl && faq.questionAr ? faq.questionAr : faq.question}
                    <ChevronRight size={18} className={`text-stone-400 group-open:rotate-90 transition-transform ${isRtl ? 'rotate-180' : ''}`} />
                  </summary>
                  <div className={`px-6 pb-6 text-stone-600 ${isRtl ? 'text-right' : 'text-left'}`}>
                    {isRtl && faq.answerAr ? faq.answerAr : faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="py-16 bg-stone-50 border-t border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold font-display text-brand-secondary mb-8">
              {isRtl ? 'منتجات ذات صلة' : 'Related Products'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(rp => (
                <Link key={rp.id} to={`/products/${dbBrands.find(b=>b.id===rp.brandId)?.slug || 'brand'}/${dbCategories.find(c=>c.id===rp.categoryId)?.slug || 'category'}/${rp.slug || rp.sku}`} className="group bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="aspect-square relative overflow-hidden bg-stone-50 p-6 flex items-center justify-center">
                    <OptimizedImage 
                      src={rp.thumbnail || rp.images?.[0] || 'https://placehold.co/400'} 
                      alt={rp.name}
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm text-brand-secondary mb-1 group-hover:text-brand-primary transition-colors line-clamp-2">
                      {isRtl && rp.nameAr ? rp.nameAr : rp.name}
                    </h3>
                    <p className="font-mono text-xs text-stone-400">{rp.sku}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40 flex gap-3">
        <button 
          onClick={() => addItem(product)}
          className="flex-1 bg-brand-primary text-white py-3 px-4 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2"
        >
          {isRtl ? 'طلب' : 'Add to List'}
        </button>
        <a 
          href={waUrl}
          target="_blank"
          rel="noreferrer"
          className="flex-1 bg-[#25D366] text-white py-3 px-4 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2"
        >
          {isRtl ? 'واتساب' : 'WhatsApp'}
        </a>
      </div>

    </div>
  );
}
