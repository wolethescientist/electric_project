'use client';

import { useState, Suspense } from 'react';
import DateRangeSelector from '@/components/analytics/DateRangeSelector';
import { 
  LazyTrendAnalysisPanel,
  LazyComparativeAnalysis,
  LazyPredictiveInsights,
  LazyOnVisible
} from '@/components/lazy/LazyComponents';
import { 
  getAnalyticsData, 
  getHistoricalTrends, 
  getPredictiveInsights, 
  getComparativeAnalysis 
} from '@/data/analytics-utils';
import { BarChart3, TrendingUp, Brain, Calendar } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface DateRange {
  start: string;
  end: string;
  label: string;
}

export default function Analytics() {
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | null>(null);
  
  // Load analytics data
  const historicalTrends = getHistoricalTrends(undefined, selectedDateRange || undefined);
  const predictiveInsights = getPredictiveInsights();
  const comparativeAnalysis = getComparativeAnalysis();

  const handleDateRangeChange = (dateRange: DateRange | null) => {
    setSelectedDateRange(dateRange);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Analytics & Insights
          </h1>
          <p className="text-gray-600">
            Advanced analytics and predictive insights for NEMSA electric meter regulation compliance
          </p>
        </div>
        
        {/* Date Range Selector */}
        <div className="mt-4 lg:mt-0">
          <DateRangeSelector 
            onDateRangeChange={handleDateRangeChange}
            selectedRange={selectedDateRange}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-linear-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Data Points</p>
              <p className="text-2xl font-bold">{historicalTrends.length}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-linear-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Predictions</p>
              <p className="text-2xl font-bold">{predictiveInsights.length}</p>
            </div>
            <Brain className="h-8 w-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-linear-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Comparisons</p>
              <p className="text-2xl font-bold">{comparativeAnalysis.length}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-linear-to-r from-orange-500 to-orange-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Date Range</p>
              <p className="text-lg font-bold">
                {selectedDateRange ? selectedDateRange.label : 'All Time'}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Analytics Modules with Lazy Loading */}
      <div className="space-y-8">
        {/* Trend Analysis Panel */}
        <LazyOnVisible fallback={<div className="h-96 flex items-center justify-center"><LoadingSpinner size="lg" /></div>}>
          <Suspense fallback={<div className="h-96 flex items-center justify-center"><LoadingSpinner size="lg" /></div>}>
            <LazyTrendAnalysisPanel 
              data={historicalTrends}
              dateRange={selectedDateRange || undefined}
            />
          </Suspense>
        </LazyOnVisible>

        {/* Predictive Insights */}
        <LazyOnVisible fallback={<div className="h-80 flex items-center justify-center"><LoadingSpinner size="lg" /></div>}>
          <Suspense fallback={<div className="h-80 flex items-center justify-center"><LoadingSpinner size="lg" /></div>}>
            <LazyPredictiveInsights data={predictiveInsights} />
          </Suspense>
        </LazyOnVisible>

        {/* Comparative Analysis */}
        <LazyOnVisible fallback={<div className="h-80 flex items-center justify-center"><LoadingSpinner size="lg" /></div>}>
          <Suspense fallback={<div className="h-80 flex items-center justify-center"><LoadingSpinner size="lg" /></div>}>
            <LazyComparativeAnalysis data={comparativeAnalysis} />
          </Suspense>
        </LazyOnVisible>
      </div>

      {/* Footer Note */}
      <div className="mt-12 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-start gap-3">
          <Brain className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-medium text-gray-900 mb-1">About Analytics</h4>
            <p className="text-sm text-gray-600">
              Our analytics module uses advanced algorithms to analyze historical compliance data, 
              identify trends, and generate predictive insights. All predictions include confidence 
              levels to help you make informed decisions about regulatory priorities and resource allocation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}