const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const sitemapCode = `
  app.get('/sitemap-categories.xml', async (req, res) => {
    try {
      const snap = await getDocs(query(collection(db, 'categories')));
      const urls = snap.docs.map(doc => ({
        loc: \`\${baseUrl}/categories/\${doc.data().slug || doc.id}\`,
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
        loc: \`\${baseUrl}/brands/\${doc.data().slug || doc.id}\`,
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
        loc: \`\${baseUrl}/blog/\${doc.data().slug || doc.id}\`,
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
        loc: \`\${baseUrl}/projects/\${doc.data().slug || doc.id}\`,
        priority: '0.8',
        changefreq: 'weekly'
      }));
      res.header('Content-Type', 'application/xml');
      res.send(generateXml(urls));
    } catch (e) { res.status(500).end(); }
  });
`;

code = code.replace("app.get('/sitemap-locations.xml'", sitemapCode + "\n  app.get('/sitemap-locations.xml'");
fs.writeFileSync('server.ts', code);
