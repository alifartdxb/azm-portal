import { db } from '../firebase';
import { 
  collection, 
  getDocs,
  DocumentSnapshot,
  QuerySnapshot
} from 'firebase/firestore';

export interface ProductFilterParams {
  categories?: string[];
  brands?: string[];
  collections?: string[];
  materials?: string[];
  finishes?: string[];
  status?: string[];
  searchQuery?: string;
  sortBy?: string; // 'Recommended', 'Newest', 'A-Z', 'Z-A', 'Brand'
  pageSize: number;
  lastDoc?: DocumentSnapshot | null;
}

// Memory cache for products to simulate fast indexed database
let cachedSnapshot: QuerySnapshot | null = null;
let lastCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCachedProducts = async () => {
  const now = Date.now();
  if (!cachedSnapshot || (now - lastCacheTime > CACHE_TTL)) {
    const productsRef = collection(db, 'products');
    cachedSnapshot = await getDocs(productsRef);
    lastCacheTime = now;
  }
  return cachedSnapshot;
};

export const clearProductsCache = () => {
  cachedSnapshot = null;
};

// Fallback logic to fetch all and paginate client-side
export const getProductsFiltered = async (params: ProductFilterParams) => {
  try {
    const snapshot = await getCachedProducts();
    
    let allProducts = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any));
    
    // Filter Drafts
    allProducts = allProducts.filter(p => p.status !== 'Draft');

    // Search
    if (params.searchQuery) {
      const q = params.searchQuery.toLowerCase();
      allProducts = allProducts.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.collection && p.collection.toLowerCase().includes(q))
      );
    }

    // Categories
    if (params.categories && params.categories.length > 0) {
      allProducts = allProducts.filter(p => params.categories!.includes(p.categoryId) || params.categories!.includes(p.category));
    }

    // Brands
    if (params.brands && params.brands.length > 0) {
      allProducts = allProducts.filter(p => params.brands!.includes(p.brandId) || params.brands!.includes(p.brand));
    }

    // Collections
    if (params.collections && params.collections.length > 0) {
      allProducts = allProducts.filter(p => params.collections!.includes(p.collection));
    }

    // Materials
    if (params.materials && params.materials.length > 0) {
      allProducts = allProducts.filter(p => params.materials!.includes(p.material));
    }

    // Finishes
    if (params.finishes && params.finishes.length > 0) {
      allProducts = allProducts.filter(p => {
        if (!p.finish) return false;
        if (Array.isArray(p.finish)) return p.finish.some((f: string) => params.finishes!.includes(f));
        return params.finishes!.includes(p.finish);
      });
    }

    // Status
    if (params.status && params.status.length > 0) {
      allProducts = allProducts.filter(p => params.status!.includes(p.status));
    }

    // Sort
    if (params.sortBy) {
      switch (params.sortBy) {
        case 'Newest':
          allProducts.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
          break;
        case 'A-Z':
          allProducts.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
          break;
        case 'Z-A':
          allProducts.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
          break;
        case 'Brand':
          allProducts.sort((a, b) => (a.brandId || '').localeCompare(b.brandId || ''));
          break;
        case 'Recommended':
          allProducts.sort((a, b) => (b.views || 0) - (a.views || 0));
          break;
      }
    } else {
      // Default sort
      allProducts.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
    }

    // Find start index
    let startIndex = 0;
    if (params.lastDoc) {
      const index = allProducts.findIndex(p => p.id === params.lastDoc!.id);
      if (index !== -1) startIndex = index + 1;
    }

    const paginatedData = allProducts.slice(startIndex, startIndex + params.pageSize);
    const hasMore = startIndex + params.pageSize < allProducts.length;

    let newLastDoc = null;
    if (paginatedData.length > 0) {
      const lastItem = paginatedData[paginatedData.length - 1];
      newLastDoc = snapshot.docs.find(d => d.id === lastItem.id) || null;
    }

    return {
      products: paginatedData,
      lastDoc: newLastDoc,
      hasMore,
      totalCount: allProducts.length
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductAggregates = async () => {
  const snapshot = await getCachedProducts();
  const allProducts = snapshot.docs.map(d => d.data() as any).filter(p => p.status !== 'Draft');
  
  const collections = new Set<string>();
  const materials = new Set<string>();
  const finishes = new Set<string>();
  const status = new Set<string>();
  
  allProducts.forEach(p => {
    if (p.collection) collections.add(p.collection);
    if (p.material) materials.add(p.material);
    if (p.status) status.add(p.status);
    if (p.finish) {
      if (Array.isArray(p.finish)) p.finish.forEach((f: string) => finishes.add(f));
      else finishes.add(p.finish);
    }
  });

  return {
    collections: Array.from(collections).filter(Boolean),
    materials: Array.from(materials).filter(Boolean),
    finishes: Array.from(finishes).filter(Boolean),
    status: Array.from(status).filter(Boolean)
  };
};

export const getProductBySlug = async (slug: string) => {
  const snapshot = await getCachedProducts();
  const allProducts = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any));
  return allProducts.find(p => p.slug === slug || p.sku === slug) || null;
};

export const getProductsByBrand = async (brandId: string) => {
  const snapshot = await getCachedProducts();
  const allProducts = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any));
  return allProducts.filter(p => (p.brandId === brandId || p.brand === brandId) && p.status !== 'Draft');
};

export const getProductsByCategory = async (categoryId: string) => {
  const snapshot = await getCachedProducts();
  const allProducts = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any));
  return allProducts.filter(p => (p.categoryId === categoryId || p.category === categoryId) && p.status !== 'Draft');
};

export const getRelatedProducts = async (product: any, limit = 4) => {
  const snapshot = await getCachedProducts();
  const allProducts = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any));
  
  // If specific related products are set
  if (product.relatedProducts && product.relatedProducts.length > 0) {
    return allProducts.filter(p => product.relatedProducts.includes(p.id) || product.relatedProducts.includes(p.sku));
  }
  
  // Fallback to same collection
  if (product.collection) {
    const sameCollection = allProducts.filter(p => p.collection === product.collection && p.id !== product.id && p.status !== 'Draft');
    if (sameCollection.length > 0) return sameCollection.slice(0, limit);
  }
  
  // Fallback to same category and brand
  const similar = allProducts.filter(p => 
    p.categoryId === product.categoryId && 
    p.brandId === product.brandId && 
    p.id !== product.id && 
    p.status !== 'Draft'
  );
  
  return similar.slice(0, limit);
};
