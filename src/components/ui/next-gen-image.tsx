
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface NextGenImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export function NextGenImage({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = 80,
  placeholder = 'empty',
  blurDataURL,
  className,
  ...props
}: NextGenImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [priority]);

  // Generate optimized sources
  const generateSources = (baseSrc: string) => {
    const baseUrl = baseSrc.split('.').slice(0, -1).join('.');
    const extension = baseSrc.split('.').pop();
    
    return {
      webp: `${baseUrl}.webp`,
      avif: `${baseUrl}.avif`,
      original: baseSrc
    };
  };

  const sources = generateSources(src);

  return (
    <div 
      ref={imgRef}
      className={cn('relative overflow-hidden', className)}
      style={{ width, height }}
    >
      {isInView ? (
        <>
          <picture>
            <source srcSet={sources.avif} type="image/avif" />
            <source srcSet={sources.webp} type="image/webp" />
            <img
              {...props}
              src={error ? sources.original : sources.webp}
              alt={alt}
              width={width}
              height={height}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              onLoad={() => setIsLoaded(true)}
              onError={() => setError(true)}
              className={cn(
                'transition-opacity duration-300',
                isLoaded ? 'opacity-100' : 'opacity-0',
                error && 'filter-none' // Remove any filters on error
              )}
            />
          </picture>
          
          {!isLoaded && placeholder === 'blur' && blurDataURL && (
            <img
              src={blurDataURL}
              alt=""
              className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110"
              aria-hidden="true"
            />
          )}
          
          {!isLoaded && placeholder === 'empty' && (
            <div 
              className="absolute inset-0 bg-muted animate-pulse"
              aria-hidden="true"
            />
          )}
        </>
      ) : (
        <div 
          className="bg-muted animate-pulse"
          style={{ 
            width: width || '100%', 
            height: height || 'auto',
            aspectRatio: width && height ? `${width}/${height}` : undefined
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
