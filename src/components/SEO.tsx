import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: 'website' | 'article' | 'product';
  image?: string;
  schemas?: any[];
  keywords?: string[];
}

export function SEO({
  title = 'Al Zahra Al Malakia Bldg. Mat. Tr. LLC | Luxury Bathroom Solutions UAE',
  description = 'Al Zahra Al Malakia Bldg. Mat. Tr. LLC is the leading supplier of luxury bathroom solutions, sanitary ware, and VADO UK products in Dubai and the UAE. Elevate your spaces with our premium collections.',
  canonical,
  type = 'website',
  image = 'https://sanipexgroup.com/default-og.jpg', // Placeholder, using a default image
  schemas = [],
  keywords = [
    "VADO UAE",
    "Bathroom Faucets UAE",
    "Luxury Bathroom Accessories UAE",
    "Bathroom Solutions Dubai",
    "Sanitary Ware Supplier UAE",
    "Kitchen Taps UAE",
    "Al Zahra Al Malakia"
  ]
}: SEOProps) {
  const location = useLocation();
  const siteUrl = 'https://www.alzahrabm.com'; // Fictional URL
  const currentUrl = canonical || `${siteUrl}${location.pathname}`;

  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Al Zahra Al Malakia Bldg. Mat. Tr. LLC",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "description": "Leading B2B supplier of luxury sanitaryware, building materials, and bathroom solutions in the UAE.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Dubai",
      "addressCountry": "AE"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+971-4-28-444-52",
      "contactType": "customer service"
    }
  };

  const allSchemas = [defaultSchema, ...schemas];

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Al Zahra Al Malakia" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Schema.org markup */}
      {allSchemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </>
  );
}
