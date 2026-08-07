const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

if (!content.includes('import { PartnerMarquee }')) {
  content = content.replace(
    /import \{ OptimizedImage \} from "\.\.\/components\/OptimizedImage";/,
    'import { OptimizedImage } from "../components/OptimizedImage";\nimport { PartnerMarquee } from "../components/PartnerMarquee";\nimport { TestimonialCarousel } from "../components/TestimonialCarousel";'
  );
  fs.writeFileSync('src/pages/Home.tsx', content);
}
