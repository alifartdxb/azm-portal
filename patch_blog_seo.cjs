const fs = require('fs');
let code = fs.readFileSync('src/pages/BlogDetail.tsx', 'utf8');

const importUpdates = `import { useState, useEffect } from 'react';
import { getCollection } from '../services/db';`;

code = code.replace("import { SEO } from '../components/SEO';", "import { SEO } from '../components/SEO';\n" + importUpdates);

const stateCode = `  const [dbPost, setDbPost] = useState<any>(null);
  
  useEffect(() => {
    async function fetchPost() {
      if (!slug) return;
      try {
        const blogs = await getCollection('blogs');
        const found = blogs.find(b => b.slug === slug || b.id === slug);
        if (found) setDbPost(found);
      } catch (e) {}
    }
    fetchPost();
  }, [slug]);

  const activePost = dbPost || post;
  
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": activePost.title,
    "image": [activePost.image || activePost.mainImage],
    "datePublished": activePost.date || activePost.createdAt,
    "author": [{
        "@type": "Person",
        "name": activePost.author || "AZM Editorial"
    }]
  };
  
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.azmgroup.ae/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://www.azmgroup.ae/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": activePost.title
      }
    ]
  };
`;

code = code.replace("const post = {", stateCode + "\n  const post = {");

code = code.replace(/post\./g, "activePost.");

code = code.replace("<SEO", "<SEO type=\"article\" schemas={[articleSchema, breadcrumbSchema]}");

fs.writeFileSync('src/pages/BlogDetail.tsx', code);
