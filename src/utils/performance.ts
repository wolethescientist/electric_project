/**
 * Performance monitoring utilities for production deployment
 */

// Web Vitals tracking
export interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  entries: PerformanceEntry[];
}

// Performance thresholds based on Core Web Vitals
export const PERFORMANCE_THRESHOLDS = {
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint
  FID: { good: 100, poor: 300 },   // First Input Delay
  CLS: { good: 0.1, poor: 0.25 },  // Cumulative Layout Shift
  TTFB: { good: 800, poor: 1800 }, // Time to First Byte
} as const;

// Get performance rating
export function getPerformanceRating(
  metric: keyof typeof PERFORMANCE_THRESHOLDS,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = PERFORMANCE_THRESHOLDS[metric];
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
}

// Track Web Vitals
export function trackWebVitals(metric: WebVitalsMetric) {
  // In production, send to analytics service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to Vercel Analytics, Google Analytics, or custom endpoint
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.value),
        custom_map: {
          metric_rating: metric.rating,
        },
      });
    }
    
    // Send to custom analytics endpoint
    fetch('/api/analytics/web-vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metric: metric.name,
        value: metric.value,
        rating: metric.rating,
        id: metric.id,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      }),
    }).catch(console.error);
  }
  
  // Development logging
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      threshold: PERFORMANCE_THRESHOLDS[metric.name as keyof typeof PERFORMANCE_THRESHOLDS],
    });
  }
}

// Performance observer for custom metrics
export class PerformanceMonitor {
  private observers: PerformanceObserver[] = [];
  
  constructor() {
    if (typeof window === 'undefined') return;
    
    this.initializeObservers();
  }
  
  private initializeObservers() {
    // Long Task Observer
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.duration > 50) {
              console.warn(`Long task detected: ${entry.duration}ms`, entry);
              
              // Track long tasks in production
              if (process.env.NODE_ENV === 'production') {
                this.trackCustomMetric('long-task', entry.duration);
              }
            }
          });
        });
        
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.push(longTaskObserver);
      } catch (e) {
        console.warn('Long task observer not supported');
      }
      
      // Resource timing observer
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            const resource = entry as PerformanceResourceTiming;
            
            // Track slow resources
            if (resource.duration > 1000) {
              console.warn(`Slow resource: ${resource.name} (${resource.duration}ms)`);
              
              if (process.env.NODE_ENV === 'production') {
                this.trackCustomMetric('slow-resource', resource.duration, {
                  resource: resource.name,
                  type: resource.initiatorType,
                });
              }
            }
          });
        });
        
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.push(resourceObserver);
      } catch (e) {
        console.warn('Resource observer not supported');
      }
    }
  }
  
  private trackCustomMetric(name: string, value: number, metadata?: Record<string, any>) {
    fetch('/api/analytics/custom-metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        value,
        metadata,
        timestamp: Date.now(),
        url: window.location.href,
      }),
    }).catch(console.error);
  }
  
  // Measure component render time
  measureComponent(name: string, fn: () => void) {
    const start = performance.now();
    fn();
    const duration = performance.now() - start;
    
    if (duration > 16) { // Longer than one frame at 60fps
      console.warn(`Slow component render: ${name} (${duration}ms)`);
      
      if (process.env.NODE_ENV === 'production') {
        this.trackCustomMetric('component-render', duration, { component: name });
      }
    }
  }
  
  // Clean up observers
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Bundle size monitoring
export function trackBundleSize() {
  if (typeof window === 'undefined') return;
  
  // Track JavaScript bundle size
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  let totalSize = 0;
  
  scripts.forEach(script => {
    const src = (script as HTMLScriptElement).src;
    if (src.includes('/_next/static/')) {
      fetch(src, { method: 'HEAD' })
        .then(response => {
          const size = parseInt(response.headers.get('content-length') || '0');
          totalSize += size;
          
          if (process.env.NODE_ENV === 'production') {
            fetch('/api/analytics/bundle-size', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                script: src,
                size,
                totalSize,
                timestamp: Date.now(),
              }),
            }).catch(console.error);
          }
        })
        .catch(console.error);
    }
  });
}

// Initialize performance monitoring
export function initializePerformanceMonitoring() {
  if (typeof window === 'undefined') return;
  
  const monitor = new PerformanceMonitor();
  
  // Track bundle size on load
  window.addEventListener('load', trackBundleSize);
  
  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    monitor.disconnect();
  });
  
  return monitor;
}

// Performance budget checker
export function checkPerformanceBudget() {
  if (typeof window === 'undefined') return;
  
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  
  const metrics = {
    TTFB: navigation.responseStart - navigation.requestStart,
    FCP: 0, // Will be set by web vitals
    LCP: 0, // Will be set by web vitals
    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
  };
  
  // Check against budgets
  const budgetViolations: string[] = [];
  
  if (metrics.TTFB > PERFORMANCE_THRESHOLDS.TTFB.poor) {
    budgetViolations.push(`TTFB: ${metrics.TTFB}ms (budget: ${PERFORMANCE_THRESHOLDS.TTFB.poor}ms)`);
  }
  
  if (budgetViolations.length > 0) {
    console.warn('Performance budget violations:', budgetViolations);
    
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/analytics/budget-violations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          violations: budgetViolations,
          metrics,
          timestamp: Date.now(),
          url: window.location.href,
        }),
      }).catch(console.error);
    }
  }
}