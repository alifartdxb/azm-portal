import express from 'express';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import { LRUCache } from 'lru-cache';
import { createServer as createViteServer } from 'vite';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const firebaseConfig = {
  apiKey: "AIzaSyAlZ8ABshX1qELu8X82ls6UDNhLdMx4qLc",
  authDomain: "gen-lang-client-0576582933.firebaseapp.com",
  projectId: "gen-lang-client-0576582933",
  storageBucket: "gen-lang-client-0576582933.firebasestorage.app",
  messagingSenderId: "122595688318",
  appId: "1:122595688318:web:1afeebee0c48e68e31bd2f"
};
const appFirebase = initializeApp(firebaseConfig);
const db = getFirestore(appFirebase, "ai-studio-azmgroupb2bplatf-c0638043-266f-426d-9543-8bd6f1f7acb3");

const baseUrl = 'https://www.azmgroup.ae'; // Assuming domain

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(compression({ level: 9 }));

  const ssrCache = new LRUCache<string, string>({
    max: 100,
    ttl: 1000 * 60 * 60, // 1 hour cache
  });
  
  // Sitemaps cache
  let sitemapCache: Record<string, {xml: string, time: number}> = {};
  const CACHE_TIME = 1000 * 60 * 60 * 24; // 24 hours

  // Helper to get collection with caching
  const getCachedCollection = async (col: string, force = false) => {
    // Only published
    const q = query(collection(db, col), where('status', '==', 'Published'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  };
  
  const generateXml = (urls: {loc: string, lastmod?: string, changefreq?: string, priority?: string}[]) => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    urls.forEach(u => {
      xml += `\n  <url>\n    <loc>${u.loc}</loc>`;
      if (u.lastmod) xml += `\n    <lastmod>${u.lastmod}</lastmod>`;
      if (u.changefreq) xml += `\n    <changefreq>${u.changefreq}</changefreq>`;
      if (u.priority) xml += `\n    <priority>${u.priority}</priority>`;
      xml += `\n  </url>`;
    });
    xml += `\n</urlset>`;
    return xml;
  };

  app.get('/sitemap.xml', (req, res) => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${baseUrl}/sitemap-pages.xml</loc></sitemap>
  <sitemap><loc>${baseUrl}/sitemap-products.xml</loc></sitemap>
  <sitemap><loc>${baseUrl}/sitemap-categories.xml</loc></sitemap>
  <sitemap><loc>${baseUrl}/sitemap-brands.xml</loc></sitemap>
  <sitemap><loc>${baseUrl}/sitemap-blog.xml</loc></sitemap>
  <sitemap><loc>${baseUrl}/sitemap-projects.xml</loc></sitemap>
  <sitemap><loc>${baseUrl}/sitemap-locations.xml</loc></sitemap>
</sitemapindex>`;
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  });
  
  app.get('/robots.txt', (req, res) => {
    res.header('Content-Type', 'text/plain');
    res.send(`User-agent: *
Allow: /
Disallow: /admin/

Sitemap: ${baseUrl}/sitemap.xml`);
  });
  
  app.get('/sitemap-pages.xml', (req, res) => {
    const urls = [
      { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
      { loc: `${baseUrl}/products`, priority: '0.9', changefreq: 'daily' },
      { loc: `${baseUrl}/categories`, priority: '0.9', changefreq: 'daily' },
      { loc: `${baseUrl}/brands`, priority: '0.9', changefreq: 'weekly' },
      { loc: `${baseUrl}/projects`, priority: '0.8', changefreq: 'weekly' },
      { loc: `${baseUrl}/blog`, priority: '0.8', changefreq: 'weekly' },
      { loc: `${baseUrl}/contact`, priority: '0.8', changefreq: 'monthly' },
      { loc: `${baseUrl}/about`, priority: '0.8', changefreq: 'monthly' },
      { loc: `${baseUrl}/product-finder`, priority: '0.8', changefreq: 'monthly' },
      { loc: `${baseUrl}/faqs`, priority: '0.7', changefreq: 'monthly' },
      { loc: `${baseUrl}/catalogues`, priority: '0.8', changefreq: 'monthly' }
    ];
    res.header('Content-Type', 'application/xml');
    res.send(generateXml(urls));
  });

  app.get('/sitemap-products.xml', async (req, res) => {
    try {
      if (sitemapCache['products'] && Date.now() - sitemapCache['products'].time < CACHE_TIME) {
        res.header('Content-Type', 'application/xml');
        return res.send(sitemapCache['products'].xml);
      }
      // Since some products might not have 'status' == 'Published' yet (maybe active), let's just fetch all non-drafts
      const q = query(collection(db, 'products'), where('status', '!=', 'Draft'));
      const snap = await getDocs(q);
      const urls = snap.docs.map(doc => {
        const p = doc.data();
        const brandSlug = p.brand?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'brand';
        const catSlug = p.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'category';
        const pSlug = p.slug || p.sku || doc.id;
        return {
          loc: `${baseUrl}/products/${brandSlug}/${catSlug}/${pSlug}`,
          priority: '0.8',
          changefreq: 'weekly',
          lastmod: p.updatedAt ? new Date(p.updatedAt).toISOString() : undefined
        };
      });
      const xml = generateXml(urls);
      sitemapCache['products'] = { xml, time: Date.now() };
      res.header('Content-Type', 'application/xml');
      res.send(xml);
    } catch (e) {
      console.error(e);
      res.status(500).end();
    }
  });

  
  app.get('/sitemap-categories.xml', async (req, res) => {
    try {
      const snap = await getDocs(query(collection(db, 'categories')));
      const urls = snap.docs.map(doc => ({
        loc: `${baseUrl}/categories/${doc.data().slug || doc.id}`,
        priority: '0.8',
        changefreq: 'weekly'
      }));
      res.header('Content-Type', 'application/xml');
      res.send(generateXml(urls));
    } catch (e) { res.status(500).end(); }
  });

  app.get('/sitemap-brands.xml', async (req, res) => {
    try {
      const snap = await getDocs(query(collection(db, 'brands')));
      const urls = snap.docs.map(doc => ({
        loc: `${baseUrl}/brands/${doc.data().slug || doc.id}`,
        priority: '0.8',
        changefreq: 'weekly'
      }));
      res.header('Content-Type', 'application/xml');
      res.send(generateXml(urls));
    } catch (e) { res.status(500).end(); }
  });

  app.get('/sitemap-blog.xml', async (req, res) => {
    try {
      const snap = await getDocs(query(collection(db, 'blogs'), where('status', '==', 'Published')));
      const urls = snap.docs.map(doc => ({
        loc: `${baseUrl}/blog/${doc.data().slug || doc.id}`,
        priority: '0.7',
        changefreq: 'weekly'
      }));
      res.header('Content-Type', 'application/xml');
      res.send(generateXml(urls));
    } catch (e) { res.status(500).end(); }
  });

  app.get('/sitemap-projects.xml', async (req, res) => {
    try {
      const snap = await getDocs(query(collection(db, 'projects'), where('status', '==', 'Published')));
      const urls = snap.docs.map(doc => ({
        loc: `${baseUrl}/projects/${doc.data().slug || doc.id}`,
        priority: '0.8',
        changefreq: 'weekly'
      }));
      res.header('Content-Type', 'application/xml');
      res.send(generateXml(urls));
    } catch (e) { res.status(500).end(); }
  });

  app.get('/sitemap-locations.xml', (req, res) => {
    const locations = ['dubai', 'abu-dhabi', 'sharjah', 'ajman', 'ras-al-khaimah', 'fujairah', 'oman', 'gcc', 'uae'];
    const urls = locations.map(loc => ({
      loc: `${baseUrl}/locations/${loc}`,
      priority: '0.9',
      changefreq: 'weekly'
    }));
    res.header('Content-Type', 'application/xml');
    res.send(generateXml(urls));
  });

  // Example API caching middleware (mock)
  app.use('/api', (req, res, next) => {
    const key = req.url;
    if (ssrCache.has(key)) {
      res.setHeader('X-Cache', 'HIT');
      res.send(ssrCache.get(key));
      return;
    }
    res.setHeader('X-Cache', 'MISS');
    next();
  });

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', environment: process.env.NODE_ENV || 'development' });
  });

  if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, {
      maxAge: '1y',
      setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache');
        }
      }
    }));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Enterprise server running on port ${PORT}`);
  });
}

startServer();
