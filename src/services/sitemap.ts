import { getCollection } from './db';

export async function fetchSitemapData() {
  const [products, categories, brands, blogs, projects] = await Promise.all([
    getCollection('products'),
    getCollection('categories'),
    getCollection('brands'),
    getCollection('blogs'),
    getCollection('projects')
  ]);

  return {
    products: products.filter((p: any) => p.status === 'Published' || p.status === 'Active'),
    categories: categories,
    brands: brands,
    blogs: blogs.filter((b: any) => b.status === 'Published'),
    projects: projects.filter((p: any) => p.status === 'Published')
  };
}
