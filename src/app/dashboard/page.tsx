'use client';

import React, { useState, Suspense } from 'react';
import { BarChart3, Grid3X3 } from 'lucide-react';
import { RegulationItem, ComplianceCriteria } from '@/types';
import { FilterPanel, RegulationItemsGrid } from '@/components/dashboard';
import RegulationItemModal from '@/components/dashboard/RegulationItemModal';
import regulationItemsData from '@/data/regulation-items.json';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import { DashboardSkeleton } from '@/components/ui/SkeletonLoader';
import ErrorFallback from '@/components/error/ErrorFallback';
import EmptyState from '@/components/error/EmptyState';
import useAsyncState from '@/hooks/useAsyncState';
import { logError } from '@/utils/errorHandling';

export default function Dashboard() {
  const [filteredItems, setFilteredItems] = useState<RegulationItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<RegulationItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Use async state for data loading
  const { data: regulationItems, loading, error, execute } = useAsyncState<RegulationItem[]>([]);

  // Load and process regulation items data
  const loadRegulationItems = React.useCallback(async (): Promise<RegulationItem[]> => {
    try {
      // Simulate API call delay in development
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      return regulationItemsData.map(item => ({
        ...item,
        status: item.status as RegulationItem['status'],
        riskLevel: item.riskLevel as RegulationItem['riskLevel'],
        lastUpdated: new Date(item.lastUpdated),
        criteria: item.criteria.map(criteria => ({
          ...criteria,
          priority: criteria.priority as ComplianceCriteria['priority'],
          lastReviewed: new Date(criteria.lastReviewed)
        }))
      }));
    } catch (err) {
      logError(err, 'Dashboard - loadRegulationItems');
      throw new Error('Failed to load regulation items. Please try again.');
    }
  }, []);

  // Load data on component mount
  React.useEffect(() => {
    execute(loadRegulationItems);
  }, [execute, loadRegulationItems]);

  // Initialize filtered items when data loads
  React.useEffect(() => {
    if (regulationItems) {
      setFilteredItems(regulationItems);
    }
  }, [regulationItems]);

  const handleItemClick = (item: RegulationItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleFilterChange = (filtered: RegulationItem[]) => {
    setFilteredItems(filtered);
  };

  const handleRetry = () => {
    execute(loadRegulationItems);
  };

  // Show loading state
  if (loading) {
    return <DashboardSkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorFallback
          error={error}
          onRetry={handleRetry}
          type="data"
          className="min-h-[400px]"
        />
      </div>
    );
  }

  // Show empty state if no data
  if (!regulationItems || regulationItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          type="data"
          title="No regulation items found"
          message="There are currently no regulation items to display. Please check back later or contact support if this seems incorrect."
          action={{
            label: "Retry",
            onClick: handleRetry
          }}
        />
      </div>
    );
  }

  // Calculate summary statistics
  const totalItems = regulationItems.length;
  const compliantItems = regulationItems.filter(item => item.status === 'compliant').length;
  const nonCompliantItems = regulationItems.filter(item => item.status === 'non-compliant').length;
  const pendingItems = regulationItems.filter(item => item.status === 'pending').length;
  const underReviewItems = regulationItems.filter(item => item.status === 'under-review').length;

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Regulation Dashboard
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Monitor and manage all NEMSA electric meter regulation categories
              </p>
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md border-l-4 border-blue-500">
              <div className="text-xl sm:text-2xl font-bold text-blue-600">{totalItems}</div>
              <div className="text-xs sm:text-sm text-gray-600">Total Items</div>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md border-l-4 border-green-500">
              <div className="text-xl sm:text-2xl font-bold text-green-600">{compliantItems}</div>
              <div className="text-xs sm:text-sm text-gray-600">Compliant</div>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md border-l-4 border-red-500">
              <div className="text-xl sm:text-2xl font-bold text-red-600">{nonCompliantItems}</div>
              <div className="text-xs sm:text-sm text-gray-600">Non-Compliant</div>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
              <div className="text-xl sm:text-2xl font-bold text-yellow-600">{pendingItems}</div>
              <div className="text-xs sm:text-sm text-gray-600">Pending</div>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md border-l-4 border-orange-500 col-span-2 sm:col-span-1">
              <div className="text-xl sm:text-2xl font-bold text-orange-600">{underReviewItems}</div>
              <div className="text-xs sm:text-sm text-gray-600">Under Review</div>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        <ErrorBoundary>
          <FilterPanel
            items={regulationItems}
            onFilterChange={handleFilterChange}
            onSortChange={() => {}} // Placeholder for future sorting functionality
          />
        </ErrorBoundary>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <Grid3X3 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" aria-hidden="true" />
            <span className="text-base sm:text-lg font-medium text-gray-900">
              Regulation Items ({filteredItems.length})
            </span>
          </div>
        </div>

        {/* Show empty state for filtered results */}
        {filteredItems.length === 0 ? (
          <EmptyState
            type="filter"
            title="No items match your filters"
            message="Try adjusting your filter criteria to see more results."
            action={{
              label: "Clear Filters",
              onClick: () => setFilteredItems(regulationItems)
            }}
          />
        ) : (
          <ErrorBoundary>
            <RegulationItemsGrid
              items={filteredItems}
              onItemClick={handleItemClick}
            />
          </ErrorBoundary>
        )}

        {/* Direct Modal for Item Details */}
        {isModalOpen && (
          <ErrorBoundary>
            <RegulationItemModal
              item={selectedItem}
              isOpen={isModalOpen}
              onClose={handleCloseModal}
            />
          </ErrorBoundary>
        )}
      </div>
    </ErrorBoundary>
  );
}