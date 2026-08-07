export interface Brand {
  id: string;
  name: string;
  nameAr?: string;
  slug: string;
  logo: string;
  banner: string;
  country: string;
  countryAr?: string;
  description: string;
  descriptionAr?: string;
  seoTitle: string;
  seoDescription: string;
  isFeatured: boolean;
  catalogues?: Document[];
  faqs?: { question: string; answer: string }[];
}

export interface Category {
  id: string;
  name: string;
  nameAr?: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
  image: string;
  banner?: string;
  parentId?: string;
  applications?: string[];
  faqs?: { question: string; answer: string }[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface Document {
  id: string;
  title: string;
  type: 'PDF Catalogue' | 'Technical Sheet' | 'Installation Guide' | 'Brochure';
  url: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  finish: string;
  color: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  brandId: string;
  categoryId: string;
  collection: string;
  series: string;
  shortDescription: string;
  description: string;
  features: string[];
  technicalSpecifications: string;
  material: string;
  finish: string[];
  color: string[];
  dimensions: string;
  weight: string;
  installationType: string[];
  application: string[];
  warranty: string;
  images: string[];
  thumbnail: string;
  documents: Document[];
  variants: ProductVariant[];
  status: 'Available' | 'On Request' | 'Coming Soon' | 'Discontinued';
  seoTitle: string;
  seoDescription: string;
  relatedProducts: string[]; // Array of product IDs
}

export interface ProductCatalog {
  sku: string;
  name: string;
  brand: string;
  category: string;
  series: string;
  collectionName?: string;
  installationType?: string[];
  color?: string[];
  application?: string[];
  description: string;
  features: string[];
  finish: string[];
  dimensions: string;
  images: string[];
  downloads: {
    technicalDatasheet?: string;
    brochurePdf?: string;
    installationGuide?: string;
  };
  warrantyInformation: string;
  relatedProducts: string[];
}
