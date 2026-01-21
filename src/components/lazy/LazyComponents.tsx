'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ComponentType } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Loading component for lazy-loaded components
const LazyLoadingFallback = () => (
  <div className="flex items-center justify-center p-8">
    <LoadingSpinner size="lg" />
  </div>
);

// Lazy load heavy chart components
export const LazyTrendAnalysisPanel = dynamic(
  () => import('@/components/analytics/TrendAnalysisPanel'),
  {
    loading: LazyLoadingFallback,
    ssr: false, // Disable SSR for chart components
  }
);

export const LazyComplianceChart = dynamic(
  () => import('@/components/metrics/ComplianceChart'),
  {
    loading: LazyLoadingFallback,
    ssr: false,
  }
);

export const LazyTrendChart = dynamic(
  () => import('@/components/metrics/TrendChart'),
  {
    loading: LazyLoadingFallback,
    ssr: false,
  }
);

export const LazyComparativeAnalysis = dynamic(
  () => import('@/components/analytics/ComparativeAnalysis'),
  {
    loading: LazyLoadingFallback,
    ssr: false,
  }
);

export const LazyPredictiveInsights = dynamic(
  () => import('@/components/analytics/PredictiveInsights'),
  {
    loading: LazyLoadingFallback,
    ssr: false,
  }
);

// Lazy load modal components (only load when needed)
export const LazyRegulationItemModal = dynamic(
  () => import('@/components/dashboard/RegulationItemModal'),
  {
    loading: LazyLoadingFallback,
    ssr: false,
  }
);

// Lazy load complex info components
export const LazyDocumentationTree = dynamic(
  () => import('@/components/info/DocumentationTree'),
  {
    loading: LazyLoadingFallback,
  }
);

export const LazyFAQAccordion = dynamic(
  () => import('@/components/info/FAQAccordion'),
  {
    loading: LazyLoadingFallback,
  }
);

// Higher-order component for lazy loading with error boundary
export function withLazyLoading<P extends object>(
  Component: ComponentType<P>,
  displayName?: string
) {
  const LazyComponent = dynamic(() => Promise.resolve(Component), {
    loading: LazyLoadingFallback,
  });
  
  LazyComponent.displayName = displayName || `LazyLoaded(${Component.displayName || Component.name})`;
  
  return LazyComponent;
}

// Preload function for critical components
export const preloadCriticalComponents = () => {
  // Preload components that are likely to be used soon
  import('@/components/dashboard/RegulationItemModal');
  import('@/components/analytics/TrendAnalysisPanel');
  import('@/components/metrics/ComplianceChart');
};

// Component for intersection observer based lazy loading
export function LazyOnVisible({ 
  children, 
  fallback = <LazyLoadingFallback />,
  rootMargin = '50px' 
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
}) {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref}>
      {isVisible ? children : fallback}
    </div>
  );
}