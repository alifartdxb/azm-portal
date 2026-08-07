import express from 'express';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import { LRUCache } from 'lru-cache';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 1. Enterprise Performance: Compression
  app.use(compression({ level: 9 })); // Maximum compression

  // 2. Enterprise Performance: Memory Caching (Mock SSR Cache / API Cache)
  const ssrCache = new LRUCache<string, string>({
    max: 100,
    ttl: 1000 * 60 * 60, // 1 hour cache
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

  // Serve static assets with heavy caching
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(process.cwd(), 'dist');
    
    // 3. Enterprise Performance: Static Asset Caching (CDN Simulation)
    app.use(express.static(distPath, {
      maxAge: '1y', // 1 year caching for static assets
      setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache'); // HTML should not be aggressively cached
        }
      }
    }));

    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // Development environment using Vite middleware
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
