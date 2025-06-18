
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { optimizeImage, createIntersectionObserver } from '@/utils/performance';

interface OptimizedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  format?: 'webp' | 'avif' | 'jpeg';
  lazy?: boolean;
  priority?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  format = 'webp',
  lazy = true,
  priority = false,
  className,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy || priority);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!lazy || priority) return;

    const observer = createIntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer?.unobserve(entry.target);
          }
        });
      }
    );

    if (imgRef.current && observer) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current && observer) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [lazy, priority]);

  const optimizedSrc = optimizeImage(src, width, height, format);
  const fallbackSrc = optimizeImage(src, width, height, 'jpeg');

  return (
    <div className={cn('relative overflow-hidden', className)} ref={imgRef}>
      {isInView && (
        <>
          <picture>
            <source srcSet={optimizedSrc} type={`image/${format}`} />
            <img
              {...props}
              src={error ? fallbackSrc : optimizedSrc}
              alt={alt}
              width={width}
              height={height}
              loading={priority ? 'eager' : 'lazy'}
              onLoad={() => setIsLoaded(true)}
              onError={() => setError(true)}
              className={cn(
                'transition-opacity duration-300',
                isLoaded ? 'opacity-100' : 'opacity-0'
              )}
            />
          </picture>
          
          {!isLoaded && (
            <div 
              className="absolute inset-0 bg-muted animate-pulse"
              style={{ aspectRatio: width && height ? `${width}/${height}` : undefined }}
            />
          )}
        </>
      )}
      
      {!isInView && (
        <div 
          className="bg-muted animate-pulse"
          style={{ 
            width: width || '100%', 
            height: height || 'auto',
            aspectRatio: width && height ? `${width}/${height}` : undefined
          }}
        />
      )}
    </div>
  );
}
