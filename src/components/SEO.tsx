import React from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: 'website' | 'article' | 'product';
  image?: string;
  schemas?: any[];
  keywords?: string[];
  index?: boolean;
}

export function SEO({
  title = 'AZM Group | Premium Building Materials in UAE',
  description = 'AZM Group is the leading supplier of luxury bathroom solutions, sanitary ware, tiles, and building materials in Dubai and across the UAE.',
  canonical,
  type = 'website',
  image = 'https://www.azmgroup.ae/og-image.jpg',
  schemas = [],
  keywords = [
    "Tiles supplier UAE",
    "Sanitary ware supplier Dubai",
    "Bathroom fittings supplier UAE",
    "Porcelain slabs UAE",
    "Building materials supplier Dubai",
    "VADO UAE",
    "Jaquar sanitary ware UAE",
    "Bathroom accessories Dubai"
  ],
  index = true
}: SEOProps) {
  const location = useLocation();
  const siteUrl = 'https://www.azmgroup.ae';
  const currentUrl = canonical || `${siteUrl}${location.pathname}`;
  
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Al Zahra Al Malakia Building Materials Trading LLC",
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
  const robots = `${index ? 'index' : 'noindex'}, follow`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={currentUrl} />
      <link rel="alternate" hrefLang="en-AE" href={currentUrl} />
      <link rel="alternate" hrefLang="ar-AE" href={`${currentUrl}?lang=ar`} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="AZM Group" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Schema.org markup */}
      {allSchemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
