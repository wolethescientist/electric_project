'use client';

import { useEffect } from 'react';
import { trackWebVitals, initializePerformanceMonitoring, checkPerformanceBudget } from '@/utils/performance';

// Type definitions for web-vitals (since we're dynamically importing)
interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  entries: PerformanceEntry[];
}

type WebVitalsCallback = (metric: WebVitalsMetric) => void;

interface WebVitalsModule {
  onCLS: (callback: WebVitalsCallback) => void;
  onFCP: (callback: WebVitalsCallback) => void;
  onFID: (callback: WebVitalsCallback) => void;
  onLCP: (callback: WebVitalsCallback) => void;
  onTTFB: (callback: WebVitalsCallback) => void;
}

export default function PerformanceMonitoring() {
  useEffect(() => {
    // Initialize performance monitoring
    const monitor = initializePerformanceMonitoring();
    
    // Check performance budget after page load
    const checkBudget = () => {
      setTimeout(checkPerformanceBudget, 1000);
    };
    
    if (document.readyState === 'complete') {
      checkBudget();
    } else {
      window.addEventListener('load', checkBudget);
    }
    
    // Web Vitals tracking - only in production or when explicitly enabled
    if (typeof window !== 'undefined' && 
        (process.env.NODE_ENV === 'production' || 
         process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === 'true')) {
      
      // Dynamic import to avoid SSR issues and handle missing dependency gracefully
      import('web-vitals')
        .then((webVitals: WebVitalsModule) => {
          webVitals.onCLS(trackWebVitals);
          webVitals.onFCP(trackWebVitals);
          webVitals.onFID(trackWebVitals);
          webVitals.onLCP(trackWebVitals);
          webVitals.onTTFB(trackWebVitals);
        })
        .catch((error) => {
          // Gracefully handle missing web-vitals dependency
          console.warn('Web Vitals library not available:', error.message);
        });
    }
    
    return () => {
      monitor?.disconnect();
      window.removeEventListener('load', checkBudget);
    };
  }, []);
  
  // This component doesn't render anything
  return null;
}