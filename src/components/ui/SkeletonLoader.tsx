interface SkeletonLoaderProps {
  className?: string;
  count?: number;
  height?: string;
  width?: string;
  rounded?: boolean;
}

export default function SkeletonLoader({ 
  className = '', 
  count = 1, 
  height = 'h-4',
  width = 'w-full',
  rounded = true
}: SkeletonLoaderProps) {
  return (
    <div className={className} role="status" aria-label="Loading content">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`loading-skeleton ${rounded ? 'rounded' : ''} ${height} ${width} mb-2 last:mb-0`}
          aria-hidden="true"
        />
      ))}
      <span className="sr-only">Loading content...</span>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md border-2 border-gray-200 p-6" role="status" aria-label="Loading regulation item">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <SkeletonLoader height="h-4" className="w-16" />
            <SkeletonLoader height="h-6" className="w-20" />
          </div>
          <SkeletonLoader height="h-6" className="w-3/4 mb-1" />
          <SkeletonLoader height="h-4" className="w-1/2" />
        </div>
        <SkeletonLoader height="h-5" className="w-5" />
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        <SkeletonLoader height="h-5" className="w-5" />
        <SkeletonLoader height="h-4" className="w-24" />
      </div>
      
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <SkeletonLoader height="h-4" className="w-24" />
          <SkeletonLoader height="h-6" className="w-12" />
        </div>
        <SkeletonLoader height="h-2" className="w-full" />
      </div>
      
      <SkeletonLoader count={2} height="h-4" className="mb-4" />
      
      <div className="flex items-center justify-between text-xs">
        <SkeletonLoader height="h-3" className="w-16" />
        <SkeletonLoader height="h-3" className="w-20" />
      </div>
      
      <span className="sr-only">Loading regulation item details...</span>
    </div>
  );
}
export
 function DashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8" role="status" aria-label="Loading dashboard">
      {/* Filter Panel Skeleton */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <SkeletonLoader height="h-4" width="w-16" className="mb-2" />
            <SkeletonLoader height="h-10" width="w-full" />
          </div>
          <div>
            <SkeletonLoader height="h-4" width="w-20" className="mb-2" />
            <SkeletonLoader height="h-10" width="w-full" />
          </div>
          <div>
            <SkeletonLoader height="h-4" width="w-14" className="mb-2" />
            <SkeletonLoader height="h-10" width="w-full" />
          </div>
          <div className="flex items-end">
            <SkeletonLoader height="h-10" width="w-24" />
          </div>
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
      
      <span className="sr-only">Loading regulation items dashboard...</span>
    </div>
  );
}

export function MetricsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8" role="status" aria-label="Loading metrics">
      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <SkeletonLoader height="h-4" width="w-20" />
              <SkeletonLoader height="h-6" width="w-6" rounded={false} />
            </div>
            <SkeletonLoader height="h-8" width="w-16" className="mb-2" />
            <SkeletonLoader height="h-3" width="w-24" />
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <SkeletonLoader height="h-6" width="w-32" className="mb-6" />
          <SkeletonLoader height="h-64" width="w-full" />
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <SkeletonLoader height="h-6" width="w-28" className="mb-6" />
          <SkeletonLoader height="h-64" width="w-full" />
        </div>
      </div>
      
      <span className="sr-only">Loading metrics and charts...</span>
    </div>
  );
}

export function AnalyticsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8" role="status" aria-label="Loading analytics">
      {/* Date Range Selector Skeleton */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <SkeletonLoader height="h-4" width="w-24" />
          <div className="flex gap-4">
            <SkeletonLoader height="h-10" width="w-32" />
            <SkeletonLoader height="h-4" width="w-4" />
            <SkeletonLoader height="h-10" width="w-32" />
          </div>
          <SkeletonLoader height="h-10" width="w-20" />
        </div>
      </div>

      {/* Analytics Charts Skeleton */}
      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <SkeletonLoader height="h-6" width="w-36" className="mb-6" />
          <SkeletonLoader height="h-80" width="w-full" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <SkeletonLoader height="h-6" width="w-40" className="mb-6" />
            <SkeletonLoader height="h-64" width="w-full" />
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <SkeletonLoader height="h-6" width="w-32" className="mb-6" />
            <SkeletonLoader height="h-64" width="w-full" />
          </div>
        </div>
      </div>
      
      <span className="sr-only">Loading analytics and insights...</span>
    </div>
  );
}