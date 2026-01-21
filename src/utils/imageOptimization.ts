/**
 * Image optimization utilities for static export
 */

// Image format priorities for modern browsers
export const SUPPORTED_FORMATS = ['image/avif', 'image/webp', 'image/jpeg', 'image/png'] as const;

// Responsive image sizes for different breakpoints
export const RESPONSIVE_SIZES = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Generate srcset for responsive images
export function generateSrcSet(basePath: string, sizes: number[]): string {
  return sizes
    .map(size => `${basePath}?w=${size} ${size}w`)
    .join(', ');
}

// Generate sizes attribute for responsive images
export function generateSizes(breakpoints: { [key: string]: string }): string {
  return Object.entries(breakpoints)
    .map(([breakpoint, size]) => 
      breakpoint === 'default' ? size : `(min-width: ${breakpoint}) ${size}`
    )
    .join(', ');
}

// Optimize image loading with lazy loading and intersection observer
export function createImageObserver(callback: (entry: IntersectionObserverEntry) => void) {
  if (typeof window === 'undefined') return null;
  
  return new IntersectionObserver(
    (entries) => {
      entries.forEach(callback);
    },
    {
      rootMargin: '50px 0px',
      threshold: 0.01,
    }
  );
}

// Preload critical images
export function preloadImage(src: string, as: 'image' = 'image'): void {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = src;
  document.head.appendChild(link);
}

// Preload critical images for above-the-fold content
export function preloadCriticalImages(): void {
  // Preload logo and hero images
  preloadImage('/logo.svg');
  preloadImage('/hero-bg.jpg');
}

// Image component props for optimized loading
export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
  quality?: number;
}

// Generate optimized image props
export function getOptimizedImageProps(
  src: string,
  options: Partial<OptimizedImageProps> = {}
): OptimizedImageProps {
  const {
    alt = '',
    width,
    height,
    priority = false,
    className = '',
    quality = 75,
  } = options;

  // Default responsive sizes
  const defaultSizes = generateSizes({
    '640px': '100vw',
    '768px': '50vw',
    '1024px': '33vw',
    'default': '25vw',
  });

  return {
    src,
    alt,
    width,
    height,
    priority,
    className,
    sizes: options.sizes || defaultSizes,
    quality,
  };
}

// Asset optimization utilities
export const AssetOptimization = {
  // Compress and optimize SVG icons
  optimizeSVG: (svgContent: string): string => {
    return svgContent
      .replace(/\s+/g, ' ') // Remove extra whitespace
      .replace(/<!--.*?-->/g, '') // Remove comments
      .replace(/\s*([<>])\s*/g, '$1') // Remove whitespace around tags
      .trim();
  },

  // Generate CSS for font loading optimization
  getFontLoadingCSS: (): string => {
    return `
      /* Font loading optimization */
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url('/fonts/inter-regular.woff2') format('woff2');
      }
      
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 600;
        font-display: swap;
        src: url('/fonts/inter-semibold.woff2') format('woff2');
      }
      
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 700;
        font-display: swap;
        src: url('/fonts/inter-bold.woff2') format('woff2');
      }
    `;
  },

  // Critical CSS extraction
  getCriticalCSS: (): string => {
    return `
      /* Critical CSS for above-the-fold content */
      html, body {
        margin: 0;
        padding: 0;
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
        line-height: 1.6;
        color: #1f2937;
        background-color: #ffffff;
      }
      
      .container {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 1rem;
      }
      
      .header {
        background-color: #ffffff;
        border-bottom: 1px solid #e5e7eb;
        position: sticky;
        top: 0;
        z-index: 50;
      }
      
      .loading-spinner {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 3px solid #f3f4f6;
        border-radius: 50%;
        border-top-color: #3b82f6;
        animation: spin 1s ease-in-out infinite;
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
  },
};

// Resource hints for performance
export function addResourceHints(): void {
  if (typeof document === 'undefined') return;

  // DNS prefetch for external resources
  const dnsPrefetchDomains = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
  ];

  dnsPrefetchDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${domain}`;
    document.head.appendChild(link);
  });

  // Preconnect to critical external resources
  const preconnectDomains = [
    'fonts.gstatic.com',
  ];

  preconnectDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = `https://${domain}`;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}