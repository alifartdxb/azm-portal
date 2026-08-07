const fs = require('fs');
let code = fs.readFileSync('src/pages/FAQs.tsx', 'utf8');

const importUpdates = `import { SEO } from '../components/SEO';\n`;
code = code.replace("import { getCollection }", importUpdates + "import { getCollection }");

const renderStart = `
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((f: any) => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  };

  return (
    <div className="pt-32 pb-24 bg-stone-50 min-h-screen">
      <SEO 
        title="Frequently Asked Questions | AZM Group"
        description="Find answers to common questions about premium building materials, sanitary ware, tiles, and our delivery services in the UAE."
        schemas={[faqSchema]}
      />
`;

code = code.replace('  return (\n    <div className="pt-32 pb-24 bg-stone-50 min-h-screen">', renderStart);

fs.writeFileSync('src/pages/FAQs.tsx', code);
