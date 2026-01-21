import { RegulationItem } from '@/types';
import RegulationItemCard from './RegulationItemCard';
import { CardSkeleton } from '@/components/ui/SkeletonLoader';

interface RegulationItemsGridProps {
  items: RegulationItem[];
  onItemClick: (item: RegulationItem) => void;
  isLoading?: boolean;
}

export default function RegulationItemsGrid({ items, onItemClick, isLoading = false }: RegulationItemsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12" role="status" aria-live="polite">
        <div className="text-gray-400 text-4xl sm:text-6xl mb-4" aria-hidden="true">📊</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No regulation items found</h3>
        <p className="text-gray-600 text-sm sm:text-base">
          Try adjusting your search criteria or filters to find regulation items.
        </p>
      </div>
    );
  }

  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
      role="grid"
      aria-label={`${items.length} regulation items`}
    >
      {items.map((item) => (
        <div key={item.id} role="gridcell">
          <RegulationItemCard
            item={item}
            onClick={onItemClick}
          />
        </div>
      ))}
    </div>
  );
}