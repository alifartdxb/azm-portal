import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export async function fetchSitemapData() {
  const [products, categories, brands, blogs, projects] = await Promise.all([
    getDocs(query(collection(db, 'products'), where('status', '==', 'Published'))).catch(() => ({ docs: [] })),
    getDocs(query(collection(db, 'categories'), where('status', '==', 'Published'))).catch(() => ({ docs: [] })),
    getDocs(query(collection(db, 'brands'), where('status', '==', 'Published'))).catch(() => ({ docs: [] })),
    getDocs(query(collection(db, 'blogs'), where('status', '==', 'Published'))).catch(() => ({ docs: [] })),
    getDocs(query(collection(db, 'projects'), where('status', '==', 'Published'))).catch(() => ({ docs: [] }))
  ]);

  return {
    products: products.docs.map(d => ({ id: d.id, ...d.data() })),
    categories: categories.docs.map(d => ({ id: d.id, ...d.data() })),
    brands: brands.docs.map(d => ({ id: d.id, ...d.data() })),
    blogs: blogs.docs.map(d => ({ id: d.id, ...d.data() })),
    projects: projects.docs.map(d => ({ id: d.id, ...d.data() }))
  };
}
