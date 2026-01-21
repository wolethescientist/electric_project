'use client';

import React, { useState, useRef, useEffect } from 'react';
import { OptimizedImageProps, createImageObserver } from '@/utils/imageOptimization';

interface OptimizedImageComponentProps extends OptimizedImageProps {
  fallback?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  sizes,
  quality = 75,
  fallback,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError,
}: OptimizedImageComponentProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Set up intersection observer for lazy loading
  useEffect(() => {
    if (priority || shouldLoad) return;

    observerRef.current = createImageObserver((entry) => {
      if (entry.isIntersecting) {
        setShouldLoad(true);
        observerRef.current?.disconnect();
      }
    });

    if (imgRef.current && observerRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority, shouldLoad]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Generate srcset for responsive images
  const generateSrcSet = (baseSrc: string) => {
    if (!width) return undefined;
    
    const sizes = [width * 0.5, width, width * 1.5, width * 2];
    return sizes
      .map(size => `${baseSrc}?w=${Math.round(size)}&q=${quality} ${Math.round(size)}w`)
      .join(', ');
  };

  // Placeholder styles
  const placeholderStyle: React.CSSProperties = {
    backgroundColor: '#f3f4f6',
    backgroundImage: placeholder === 'blur' && blurDataURL ? `url(${blurDataURL})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: placeholder === 'blur' ? 'blur(10px)' : undefined,
    transition: 'opacity 0.3s ease-in-out',
  };

  // Container styles
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    width: width ? `${width}px` : '100%',
    height: height ? `${height}px` : 'auto',
  };

  // Image styles
  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: isLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
  };

  // Show fallback if error and fallback is provided
  if (hasError && fallback) {
    return (
      <img
        ref={imgRef}
        src={fallback}
        alt={alt}
        className={className}
        style={imageStyle}
        onLoad={handleLoad}
      />
    );
  }

  // Show error state if no fallback
  if (hasError) {
    return (
      <div 
        className={`${className} flex items-center justify-center bg-gray-100 text-gray-400`}
        style={containerStyle}
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      </div>
    );
  }

  return (
    <div className={className} style={containerStyle}>
      {/* Placeholder */}
      {!isLoaded && (
        <div
          style={{
            ...placeholderStyle,
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        />
      )}

      {/* Actual image */}
      {shouldLoad && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          srcSet={generateSrcSet(src)}
          style={imageStyle}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
}

// Higher-order component for automatic optimization
export function withImageOptimization<P extends { src: string; alt: string }>(
  Component: React.ComponentType<P>
) {
  return function OptimizedComponent(props: P) {
    const optimizedProps = {
      ...props,
      loading: 'lazy' as const,
      decoding: 'async' as const,
    };

    return <Component {...optimizedProps} />;
  };
}

// Utility component for hero images with priority loading
export function HeroImage(props: OptimizedImageComponentProps) {
  return (
    <OptimizedImage
      {...props}
      priority={true}
      placeholder="blur"
      className={`${props.className || ''} hero-image`}
    />
  );
}

// Utility component for avatar/profile images
export function AvatarImage(props: OptimizedImageComponentProps) {
  return (
    <OptimizedImage
      {...props}
      className={`${props.className || ''} rounded-full`}
      fallback="/default-avatar.svg"
    />
  );
}