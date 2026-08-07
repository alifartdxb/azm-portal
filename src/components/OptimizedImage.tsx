import { useState, ImgHTMLAttributes } from 'react';

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
}

export function OptimizedImage({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc = 'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=200&auto=format&fit=crop',
  ...props 
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Simulating CDN transformation
  const getCdnUrl = (url: string | undefined) => {
    if (!url) return '';
    // In a real app we'd append width/quality params for a CDN like Cloudinary or Imgix
    if (url.includes('unsplash.com')) {
      return url.includes('auto=format') ? url : `${url}&auto=format&fit=crop&q=80`;
    }
    return url;
  };

  return (
    <div className={`relative overflow-hidden bg-stone-100 ${className}`}>
      {!isLoaded && !error && (
        <div className="absolute inset-0 animate-pulse bg-stone-200" />
      )}
      <img
        src={error || !src ? fallbackSrc : getCdnUrl(src)}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setError(true);
          setIsLoaded(true);
        }}
        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        {...props}
      />
    </div>
  );
}
