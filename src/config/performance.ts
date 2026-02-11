/**
 * Performance optimization configuration for the Electric Testing Facility
 */

export const PERFORMANCE_CONFIG = {
  // Target load times (in milliseconds)
  TARGET_LOAD_TIME: 3000,
  TARGET_FCP: 1800, // First Contentful Paint
  TARGET_LCP: 2500, // Largest Contentful Paint
  TARGET_FID: 100,  // First Input Delay
  TARGET_CLS: 0.1,  // Cumulative Layout Shift

  // Lazy loading thresholds
  LAZY_LOAD_THRESHOLD: '50px',
  
  // Image optimization
  IMAGE_QUALITY: 85,
  IMAGE_FORMATS: ['webp', 'avif', 'jpg'],
  
  // Bundle optimization
  CHUNK_SIZE_WARNING: 244000, // 244KB
  
  // Caching strategies
  CACHE_STRATEGIES: {
    static: 'max-age=31536000', // 1 year
    api: 'max-age=300',         // 5 minutes
    pages: 'max-age=3600'       // 1 hour
  }
};

export const ACCESSIBILITY_CONFIG = {
  // Minimum contrast ratios (WCAG AA)
  MIN_CONTRAST_NORMAL: 4.5,
  MIN_CONTRAST_LARGE: 3.0,
  
  // Touch target sizes (in pixels)
  MIN_TOUCH_TARGET: 44,
  
  // Animation preferences
  RESPECT_REDUCED_MOTION: true,
  
  // Focus management
  FOCUS_TRAP_ENABLED: true,
  SKIP_LINKS_ENABLED: true,
  
  // Screen reader support
  ARIA_LIVE_REGIONS: true,
  SEMANTIC_HTML: true
};

export const RESPONSIVE_BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

// Performance monitoring utilities
export const logPerformanceMetric = (name: string, value: number, target: number) => {
  if (process.env.NODE_ENV === 'development') {
    const status = value <= target ? '✅' : '⚠️';
    console.log(`${status} ${name}: ${value.toFixed(2)}ms (target: ${target}ms)`);
  }
};

export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  const duration = end - start;
  
  logPerformanceMetric(name, duration, PERFORMANCE_CONFIG.TARGET_LOAD_TIME);
  return duration;
};