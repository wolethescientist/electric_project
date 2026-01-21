'use client';

import LoadingSpinner from './LoadingSpinner';
import ProgressBar from './ProgressBar';
import { DashboardSkeleton, MetricsSkeleton, AnalyticsSkeleton, CardSkeleton } from './SkeletonLoader';

interface LoadingStateProps {
  type?: 'spinner' | 'skeleton' | 'progress';
  variant?: 'dashboard' | 'metrics' | 'analytics' | 'card' | 'generic';
  progress?: number;
  message?: string;
  className?: string;
}

export default function LoadingState({
  type = 'spinner',
  variant = 'generic',
  progress,
  message,
  className = ''
}: LoadingStateProps) {
  if (type === 'progress' && progress !== undefined) {
    return (
      <div className={`p-8 ${className}`}>
        <ProgressBar
          progress={progress}
          label={message}
          showPercentage
          className="max-w-md mx-auto"
        />
      </div>
    );
  }

  if (type === 'skeleton') {
    switch (variant) {
      case 'dashboard':
        return <DashboardSkeleton />;
      case 'metrics':
        return <MetricsSkeleton />;
      case 'analytics':
        return <AnalyticsSkeleton />;
      case 'card':
        return <CardSkeleton />;
      default:
        return (
          <div className={`p-8 ${className}`}>
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="loading-skeleton h-8 w-3/4 rounded" />
              <div className="loading-skeleton h-4 w-full rounded" />
              <div className="loading-skeleton h-4 w-5/6 rounded" />
              <div className="loading-skeleton h-4 w-4/5 rounded" />
            </div>
          </div>
        );
    }
  }

  // Default spinner
  return (
    <div className={`min-h-[200px] flex items-center justify-center ${className}`}>
      <LoadingSpinner size="lg" text={message} />
    </div>
  );
}

// Specific loading components for common use cases
export function PageLoading({ message = 'Loading page...' }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoadingSpinner size="xl" text={message} />
    </div>
  );
}

export function ComponentLoading({ message }: { message?: string }) {
  return (
    <div className="min-h-[100px] flex items-center justify-center">
      <LoadingSpinner size="md" text={message} />
    </div>
  );
}

export function InlineLoading() {
  return (
    <div className="inline-flex items-center gap-2">
      <LoadingSpinner size="sm" />
      <span className="text-sm text-gray-600">Loading...</span>
    </div>
  );
}