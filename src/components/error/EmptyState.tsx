import { Search, FileText, Database, Filter } from 'lucide-react';

interface EmptyStateProps {
  type?: 'search' | 'data' | 'filter' | 'generic';
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const emptyStateConfig = {
  search: {
    icon: Search,
    title: 'No results found',
    message: 'Try adjusting your search terms or filters to find what you\'re looking for.'
  },
  data: {
    icon: Database,
    title: 'No data available',
    message: 'There is currently no data to display. Please check back later.'
  },
  filter: {
    icon: Filter,
    title: 'No items match your filters',
    message: 'Try adjusting your filter criteria to see more results.'
  },
  generic: {
    icon: FileText,
    title: 'Nothing to show',
    message: 'There are no items to display at this time.'
  }
};

export default function EmptyState({
  type = 'generic',
  title,
  message,
  action,
  className = ''
}: EmptyStateProps) {
  const config = emptyStateConfig[type];
  const Icon = config.icon;

  const displayTitle = title || config.title;
  const displayMessage = message || config.message;

  return (
    <div className={`flex items-center justify-center p-12 ${className}`}>
      <div className="max-w-sm w-full text-center">
        <Icon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {displayTitle}
        </h3>
        <p className="text-gray-500 mb-6">
          {displayMessage}
        </p>
        
        {action && (
          <button
            onClick={action.onClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}