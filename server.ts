import express from 'express';
import compression from 'compression';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { spawn } from 'child_process';

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  app.use(compression({ level: 9 }));
  
  // Start PHP Development Server
  if (process.env.NODE_ENV !== 'production') {
    console.log('Starting PHP Server on port 8000...');
    const php = spawn('php', ['-S', '127.0.0.1:8000', '-t', 'public']);
    php.stdout.on('data', (data) => console.log(`PHP: ${data}`));
    php.stderr.on('data', (data) => console.error(`PHP: ${data}`));
  }
  
  // Proxy API requests to PHP server
  app.use('/api', createProxyMiddleware({ 
    target: 'http://127.0.0.1:8000', 
    changeOrigin: true,
    pathRewrite: (path) => {
      // Rewrite /api/users to /api/users.php
      const match = path.match(/^\/api\/([a-zA-Z0-9_-]+)(\?.*)?$/);
      if (match) {
        return `/api/${match[1]}.php${match[2] || ''}`;
      }
      return path;
    }
  }));

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
