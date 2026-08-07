import { Brand, Category, Product, ProductCatalog } from './types';

export const BRANDS_DATA: Brand[] = [
  {
    id: "b1",
    name: "VADO",
    slug: "vado",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Vado_Logo.svg/1200px-Vado_Logo.svg.png",
    banner: "https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=2000&auto=format&fit=crop",
    country: "United Kingdom",
    description: "VADO is a leading British bathroom brassware manufacturer renowned for its uncompromising quality, striking designs and technical innovation.",
    seoTitle: "VADO Bathroom Products UAE | AZM Group",
    seoDescription: "Explore premium VADO bathroom fittings, mixers and shower systems available from AZM Group Dubai.",
    isFeatured: true
  },
  {
    id: "b2",
    name: "JAQUAR",
    slug: "jaquar",
    logo: "https://via.placeholder.com/300x100/ffffff/000000?text=JAQUAR",
    banner: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=2000&auto=format&fit=crop",
    country: "India",
    description: "Jaquar is a leading complete bathroom and lighting solutions brand, offering an extensive range of products.",
    seoTitle: "JAQUAR Bathroom Solutions UAE | AZM Group",
    seoDescription: "Premium Jaquar sanitary ware, fittings and wellness products at AZM Group Dubai.",
    isFeatured: true
  },
  {
    id: "b3",
    name: "ITALIAN STANDARDS",
    slug: "italian-standards",
    logo: "https://via.placeholder.com/300x100/ffffff/000000?text=ITALIAN+STANDARDS",
    banner: "https://images.unsplash.com/photo-1507652313519-d4e9174296fc?q=80&w=2000&auto=format&fit=crop",
    country: "Italy",
    description: "Luxury Italian sanitaryware and bathroom furniture known for exceptional design and quality.",
    seoTitle: "Italian Standards Sanitaryware | AZM Group",
    seoDescription: "Exquisite Italian Standards bathroom products available in Dubai, UAE.",
    isFeatured: false
  },
  { id: "b4", name: "NOURK", slug: "nourk", logo: "https://via.placeholder.com/300x100/ffffff/000000?text=NOURK", banner: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?q=80&w=2000", country: "Global", description: "Premium bathroom essentials.", seoTitle: "NOURK Bathroom Essentials", seoDescription: "NOURK brand products.", isFeatured: false },
  { id: "b5", name: "SANIT", slug: "sanit", logo: "https://via.placeholder.com/300x100/ffffff/000000?text=SANIT", banner: "https://images.unsplash.com/photo-1504307651254-35680f356f90?q=80&w=2000", country: "Germany", description: "Concealed systems and flushing technology.", seoTitle: "Sanit Flushing Systems UAE", seoDescription: "German engineered concealed flushing systems.", isFeatured: false },
  { id: "b6", name: "SONET", slug: "sonet", logo: "https://via.placeholder.com/300x100/ffffff/000000?text=SONET", banner: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2000", country: "Global", description: "Quality sanitary solutions.", seoTitle: "Sonet Sanitaryware", seoDescription: "Quality sanitary solutions.", isFeatured: false },
  { id: "b7", name: "ROMAN", slug: "roman", logo: "https://via.placeholder.com/300x100/ffffff/000000?text=ROMAN", banner: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2000", country: "United Kingdom", description: "Leading designer and manufacturer of shower enclosures.", seoTitle: "Roman Showers UAE | AZM Group", seoDescription: "Roman Shower enclosures and bath screens in UAE.", isFeatured: true },
  { id: "b8", name: "KLUDI RAK", slug: "kludi-rak", logo: "https://via.placeholder.com/300x100/ffffff/000000?text=KLUDI+RAK", banner: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000", country: "UAE/Germany", description: "Joint venture producing high-quality bathroom fittings.", seoTitle: "Kludi RAK Mixers | AZM Group", seoDescription: "Kludi RAK bathroom and kitchen fittings.", isFeatured: false }
];

export const CATEGORIES_DATA: Category[] = [
  { id: "c1", name: "Bathroom Mixers", slug: "mixers", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop" },
  { id: "c2", name: "Shower Systems", slug: "shower-systems", image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=400&auto=format&fit=crop" },
  { id: "c3", name: "Kitchen Taps", slug: "kitchen-taps", image: "https://images.unsplash.com/photo-1556910103-1c02745a872f?q=80&w=400&auto=format&fit=crop" },
  { id: "c4", name: "Accessories", slug: "accessories", image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=400&auto=format&fit=crop" },
  { id: "c5", name: "Wash Basins", slug: "wash-basins", image: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?q=80&w=400&auto=format&fit=crop" },
  { id: "c6", name: "Bathtubs", slug: "bathtubs", image: "https://images.unsplash.com/photo-1507652313519-d4e9174996cb?q=80&w=400&auto=format&fit=crop" }
];

export const PRODUCTS_DATA: Product[] = [
  {
    id: "p1",
    sku: "VADO-IND-100",
    name: "Individual Brushed Gold Basin Mixer",
    slug: "individual-brushed-gold-basin-mixer",
    brandId: "b1",
    categoryId: "c1",
    collection: "Individual Elements",
    series: "Individual",
    shortDescription: "Premium single lever basin mixer with an elegant knurled detail.",
    description: "The Individual collection represents the pinnacle of bespoke bathroom design. This premium single lever basin mixer features an elegant knurled detail and is finished in brushed gold, bringing a touch of luxury to any modern bathroom.",
    features: ["H2Eco Technology for water saving", "Ceramic Cartridge for smooth operation", "Knurled Accent on the handle", "Solid brass construction"],
    technicalSpecifications: "Minimum operating pressure: 1.0 bar. Flow rate at 3.0 bar: 5 l/min.",
    material: "Brass",
    finish: ["Brushed Gold", "Chrome", "Brushed Black"],
    color: ["Gold"],
    dimensions: "160mm (H) x 140mm (D) x 45mm (W)",
    weight: "1.2 kg",
    installationType: ["Deck Mounted"],
    application: ["Residential", "Commercial", "Hospitality"],
    warranty: "12 Years Guarantee",
    images: ["https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop", "https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=1000&auto=format&fit=crop"],
    thumbnail: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    documents: [
      { id: "d1", title: "Technical Datasheet", type: "Technical Sheet", url: "#" },
      { id: "d2", title: "Installation Guide", type: "Installation Guide", url: "#" }
    ],
    variants: [
      { id: "v1", sku: "VADO-IND-100-BG", finish: "Brushed Gold", color: "Gold" },
      { id: "v2", sku: "VADO-IND-100-CH", finish: "Chrome", color: "Silver" },
      { id: "v3", sku: "VADO-IND-100-BK", finish: "Brushed Black", color: "Black" }
    ],
    status: "Available",
    seoTitle: "VADO Individual Brushed Gold Basin Mixer | AZM Group",
    seoDescription: "Shop the VADO Individual Brushed Gold Basin Mixer at AZM Group. Premium luxury bathroom mixer with knurled detail.",
    relatedProducts: ["p2"]
  },
  {
    id: "p2",
    sku: "VADO-SEN-200",
    name: "Sensori Smart Touch Shower",
    slug: "sensori-smart-touch-shower",
    brandId: "b1",
    categoryId: "c2",
    collection: "Sensori",
    series: "Smart Showers",
    shortDescription: "Digital shower control mapping with precision thermostatic control.",
    description: "Sensori introduces a new era of showering with digital precision. Save your perfect temperature and flow settings for a personalized showering experience every time.",
    features: ["Digital touch interface", "Memory presets for multiple users", "Anti-scald protection", "Wireless controller option"],
    technicalSpecifications: "Minimum operating pressure: 1.5 bar.",
    material: "Brass / Glass",
    finish: ["Black Glass", "White Glass"],
    color: ["Black", "White"],
    dimensions: "200mm x 150mm x 10mm",
    weight: "2.5 kg",
    installationType: ["Wall Mounted", "Concealed"],
    application: ["Residential", "Hospitality"],
    warranty: "5 Years Guarantee",
    images: ["https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=1000&auto=format&fit=crop"],
    thumbnail: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=400&auto=format&fit=crop",
    documents: [
      { id: "d3", title: "Sensori Brochure", type: "Brochure", url: "#" }
    ],
    variants: [],
    status: "Available",
    seoTitle: "VADO Sensori Smart Touch Shower | AZM Group",
    seoDescription: "Experience the ultimate in digital showering with the VADO Sensori Smart Touch Shower.",
    relatedProducts: ["p1"]
  },
  {
    id: "p3",
    sku: "JAQ-ART-400",
    name: "Artize Confluence Basin Mixer",
    slug: "artize-confluence-basin-mixer",
    brandId: "b2",
    categoryId: "c1",
    collection: "Artize",
    series: "Confluence",
    shortDescription: "Biomorphic design basin mixer inspired by nature.",
    description: "The Confluence basin mixer channels water in a tranquil, natural flow, inspired by the movement of rivers.",
    features: ["Natural water flow", "Biomorphic design", "Premium cartridge"],
    technicalSpecifications: "Minimum operating pressure: 1.0 bar.",
    material: "Brass",
    finish: ["Chrome"],
    color: ["Silver"],
    dimensions: "180mm x 160mm x 50mm",
    weight: "1.8 kg",
    installationType: ["Deck Mounted"],
    application: ["Residential", "Hospitality"],
    warranty: "10 Years Guarantee",
    images: ["https://images.unsplash.com/photo-1584622781564-1d987f7333c1?q=80&w=1000&auto=format&fit=crop"],
    thumbnail: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?q=80&w=400&auto=format&fit=crop",
    documents: [],
    variants: [],
    status: "Available",
    seoTitle: "Jaquar Artize Confluence Basin Mixer | AZM Group",
    seoDescription: "Luxury biomorphic basin mixer from Jaquar's Artize collection.",
    relatedProducts: []
  }
];

// Helper functions for easy data access
export function getBrandBySlug(slug: string): Brand | undefined {
  return BRANDS_DATA.find(b => b.slug === slug);
}

export function getProductsByBrand(brandId: string): Product[] {
  return PRODUCTS_DATA.filter(p => p.brandId === brandId);
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS_DATA.find(p => p.slug === slug);
}

export function getCategoryById(categoryId: string): Category | undefined {
  return CATEGORIES_DATA.find(c => c.id === categoryId);
}

// Keep the old search function for backward compatibility or replace it
export function searchProducts(query: string) {
  if (!query) return [];
  const lowerQuery = query.toLowerCase();
  
  return PRODUCTS_DATA.filter(product => 
    (product.name || '').toLowerCase().includes(lowerQuery) ||
    (product.sku || '').toLowerCase().includes(lowerQuery) ||
    (product.collection || '').toLowerCase().includes(lowerQuery) ||
    (product.series || '').toLowerCase().includes(lowerQuery)
  );
}
