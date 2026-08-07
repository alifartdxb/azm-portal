import { useParams, Link, Navigate } from "react-router-dom";
import { CATEGORIES_DATA, PRODUCTS_DATA, BRANDS_DATA } from "../data";
import { motion } from "motion/react";
import { ArrowRight, Download, MessageCircle, FileText, ChevronRight } from "lucide-react";
import { SEO } from "../components/SEO";

export function CategoryDetail() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  
  const category = CATEGORIES_DATA.find((c) => c.slug === categorySlug);
  
  if (!category) {
    return <Navigate to="/categories" replace />;
  }

  // Find products for this category
  const categoryProducts = PRODUCTS_DATA.filter(p => p.categoryId === category.id);
  
  // Find featured brands related to this category (brands that have products in this category)
  const categoryBrandIds = Array.from(new Set(categoryProducts.map(p => p.brandId)));
  const categoryBrands = BRANDS_DATA.filter(b => categoryBrandIds.includes(b.id));

  return (
    <>
      <SEO 
        title={category.seoTitle || `${category.name} | AZM Group`}
        description={category.seoDescription || category.description || `Explore ${category.name} at AZM Group.`}
      />
      
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 md:pt-40 md:pb-32 bg-stone-900 overflow-hidden">
        {category.banner && (
          <>
            <div className="absolute inset-0">
              <img
                src={category.banner}
                alt={category.name}
                className="w-full h-full object-cover opacity-40"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/60 to-transparent" />
          </>
        )}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            <div className="flex items-center text-sm text-stone-400 mb-6 font-medium tracking-wider uppercase">
              <Link to="/categories" className="hover:text-white transition-colors">Categories</Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="text-white">{category.name}</span>
            </div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-6xl font-light mb-4"
            >
              {category.name}
            </motion.h1>
            {category.nameAr && (
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-2xl md:text-4xl font-arabic text-stone-300 mb-6"
              >
                {category.nameAr}
              </motion.h2>
            )}
            {category.description && (
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg md:text-xl text-stone-300 max-w-2xl mb-4"
              >
                {category.description}
              </motion.p>
            )}
            {category.descriptionAr && (
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-lg md:text-xl text-stone-300 max-w-2xl mb-8 font-arabic text-right" dir="rtl"
              >
                {category.descriptionAr}
              </motion.p>
            )}
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <a href="#products" className="px-8 py-4 bg-white text-stone-900 font-medium hover:bg-stone-100 transition-colors">
                View Products
              </a>
              <a href="#quote" className="px-8 py-4 border border-white/30 text-white font-medium hover:bg-white/10 transition-colors">
                Request Quote
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div id="products" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-light text-stone-900">Featured {category.name}</h2>
              <div className="w-12 h-1 bg-brand-primary mt-4"></div>
            </div>
            <Link to={`/products?category=${category.id}`} className="hidden md:flex items-center text-brand-primary font-medium hover:text-brand-primary/80 transition-colors">
              View All <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          {categoryProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {categoryProducts.map((product) => (
                <div key={product.id} className="group cursor-pointer">
                  <div className="relative aspect-square mb-4 bg-stone-100 overflow-hidden">
                    <img
                      src={product.thumbnail || product.images[0]}
                      alt={product.name}
                      className="object-cover w-full h-full mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white text-xs font-medium uppercase tracking-wider text-stone-900">
                        {BRANDS_DATA.find(b => b.id === product.brandId)?.name || 'Brand'}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-stone-900 mb-1 group-hover:text-brand-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-stone-500 line-clamp-2">
                    {product.shortDescription}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-stone-50 rounded-lg border border-stone-200">
              <p className="text-stone-500">Products are currently being updated for this category.</p>
            </div>
          )}
          
          <div className="mt-8 md:hidden">
            <Link to={`/products?category=${category.id}`} className="flex items-center justify-center w-full py-4 border border-stone-200 text-stone-900 font-medium hover:bg-stone-50 transition-colors">
              View All Products
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Brands */}
      {categoryBrands.length > 0 && (
        <div className="py-20 bg-stone-50 border-t border-stone-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-light text-stone-900 mb-4">Brands in this Category</h2>
              <p className="text-stone-600 text-lg">
                We partner with the world's leading manufacturers to bring you the best in {category.name.toLowerCase()}.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
              {categoryBrands.map((brand) => (
                <Link key={brand.id} to={`/brands/${brand.slug}`} className="group block bg-white p-6 rounded-xl border border-stone-200 shadow-sm hover:shadow-md hover:border-brand-primary/30 transition-all">
                  <div className="aspect-[3/2] flex items-center justify-center relative">
                    {brand.logo.includes('placeholder') ? (
                      <span className="text-xl font-bold text-stone-400 group-hover:text-brand-primary transition-colors">{brand.name}</span>
                    ) : (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="max-h-full max-w-full object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                      />
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Related Downloads */}
      <div className="py-20 bg-white border-t border-stone-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-light text-stone-900">Related Downloads</h2>
              <div className="w-12 h-1 bg-brand-primary mt-4"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a href="#" className="flex items-start p-6 bg-stone-50 border border-stone-200 hover:border-brand-primary transition-colors group">
              <FileText className="w-8 h-8 text-stone-400 group-hover:text-brand-primary flex-shrink-0 mt-1" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-stone-900 mb-1">{category.name} Buyer's Guide</h3>
                <p className="text-sm text-stone-500 mb-3">Comprehensive guide to selecting the right products.</p>
                <span className="text-sm font-medium text-brand-primary flex items-center">
                  Download PDF <Download className="w-4 h-4 ml-1" />
                </span>
              </div>
            </a>
            {/* Add more generic downloads if needed */}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div id="quote" className="py-20 bg-brand-primary text-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-light mb-6">Need a quotation for {category.name}?</h2>
          <p className="text-brand-accent/80 mb-10 text-lg">
            Our technical sales team is ready to assist you with specifications, pricing, and availability.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-4 bg-white text-brand-primary font-medium hover:bg-stone-100 transition-colors w-full sm:w-auto"
            >
              Request Quotation
            </Link>
            <a
              href="https://wa.me/971500000000"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border border-white/30 text-white font-medium hover:bg-white/10 transition-colors flex items-center justify-center w-full sm:w-auto"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
