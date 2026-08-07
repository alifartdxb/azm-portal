import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { CATEGORIES_DATA } from "../data";
import { ArrowRight } from "lucide-react";
import { SEO } from "../components/SEO";

export function Categories() {
  return (
    <>
      <SEO 
        title="Product Categories | AZM Group"
        description="Explore our wide range of premium building materials, sanitary ware, tiles, marble, and more at AZM Group Dubai."
      />
      
      <div className="pt-24 pb-12 md:pt-32 md:pb-20 bg-stone-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-light text-stone-900 mb-6">
              Product Categories
            </h1>
            <p className="text-lg text-stone-600">
              Discover our comprehensive selection of premium building materials, luxury sanitary ware, and architectural finishes. 
              Designed to meet the rigorous standards of architects, designers, and contractors in the UAE.
            </p>
          </div>
        </div>
      </div>

      <div className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CATEGORIES_DATA.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Link
                  to={`/categories/${category.slug}`}
                  className="group block relative overflow-hidden bg-stone-100 aspect-[4/3] rounded-lg"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 md:p-8">
                    <h3 className="text-2xl font-light text-white mb-2">{category.name}</h3>
                    {category.nameAr && (
                      <h4 className="text-lg font-arabic text-stone-300 mb-2">{category.nameAr}</h4>
                    )}
                    <div className="flex items-center text-white/90 text-sm font-medium mt-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      Explore Category
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-brand-primary text-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-light mb-6">Need expert assistance?</h2>
          <p className="text-brand-accent/80 mb-10 text-lg">
            Our architectural consultants are ready to help you specify the right products for your project.
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
              className="px-8 py-4 border border-white/30 text-white font-medium hover:bg-white/10 transition-colors w-full sm:w-auto"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
