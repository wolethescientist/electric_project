import React, { useState } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { RegulationItem } from '@/types';
import { generateId, handleKeyboardNavigation } from '@/utils/accessibility';

interface FilterPanelProps {
  items: RegulationItem[];
  onFilterChange: (filteredItems: RegulationItem[]) => void;
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export default function FilterPanel({ items, onFilterChange, onSortChange }: FilterPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Generate unique IDs for form elements
  const searchId = generateId('search');
  const categoryId = generateId('category');
  const statusId = generateId('status');
  const riskId = generateId('risk');

  // Get unique values for filter options
  const categories = Array.from(new Set(items.map(item => item.category))).sort();
  const statuses = Array.from(new Set(items.map(item => item.status))).sort();
  const riskLevels = Array.from(new Set(items.map(item => item.riskLevel))).sort();

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'category', label: 'Category' },
    { value: 'status', label: 'Status' },
    { value: 'complianceRate', label: 'Compliance Rate' },
    { value: 'lastUpdated', label: 'Last Updated' },
    { value: 'riskLevel', label: 'Risk Level' }
  ];

  // Apply filters and search
  const applyFilters = () => {
    let filtered = items.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === '' || item.category === selectedCategory;
      const matchesStatus = selectedStatus === '' || item.status === selectedStatus;
      const matchesRiskLevel = selectedRiskLevel === '' || item.riskLevel === selectedRiskLevel;

      return matchesSearch && matchesCategory && matchesStatus && matchesRiskLevel;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof RegulationItem];
      let bValue: any = b[sortBy as keyof RegulationItem];

      // Handle date sorting
      if (sortBy === 'lastUpdated') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      // Handle numeric sorting
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Handle string sorting
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

    onFilterChange(filtered);
  };

  // Apply filters whenever any filter changes
  React.useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedCategory, selectedStatus, selectedRiskLevel, sortBy, sortOrder]);

  // Handle sort change
  const handleSortChange = (newSortBy: string) => {
    if (newSortBy === sortBy) {
      // Toggle sort order if same field
      const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
      setSortOrder(newSortOrder);
      onSortChange(sortBy, newSortOrder);
    } else {
      // Change sort field
      setSortBy(newSortBy);
      setSortOrder('asc');
      onSortChange(newSortBy, 'asc');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedStatus('');
    setSelectedRiskLevel('');
    setSortBy('name');
    setSortOrder('asc');
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedStatus || selectedRiskLevel;

  const handleFilterToggleKeyDown = (event: React.KeyboardEvent) => {
    handleKeyboardNavigation(event, () => setIsFilterOpen(!isFilterOpen));
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6" role="region" aria-label="Filter and search controls">
      <div className="p-4">
        {/* Search Bar */}
        <div className="relative mb-4">
          <label htmlFor={searchId} className="sr-only">
            Search regulation items by name, description, or ID
          </label>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
          <input
            id={searchId}
            type="text"
            placeholder="Search regulation items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
            aria-describedby={`${searchId}-help`}
          />
          <div id={`${searchId}-help`} className="sr-only">
            Search by regulation item name, description, or ID number
          </div>
        </div>

        {/* Filter Toggle Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            onKeyDown={handleFilterToggleKeyDown}
            className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px]"
            aria-expanded={isFilterOpen}
            aria-controls="filter-options"
            aria-label={isFilterOpen ? 'Hide filter options' : 'Show filter options'}
          >
            <Filter className="w-4 h-4" aria-hidden="true" />
            Filters
            <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md min-h-[44px]"
              aria-label="Clear all active filters"
            >
              <X className="w-4 h-4" aria-hidden="true" />
              Clear Filters
            </button>
          )}
        </div>

        {/* Filter Options */}
        {isFilterOpen && (
          <div id="filter-options" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
            {/* Category Filter */}
            <div>
              <label htmlFor={categoryId} className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id={categoryId}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
                aria-label="Filter by regulation category"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor={statusId} className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id={statusId}
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
                aria-label="Filter by compliance status"
              >
                <option value="">All Statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Risk Level Filter */}
            <div>
              <label htmlFor={riskId} className="block text-sm font-medium text-gray-700 mb-2">
                Risk Level
              </label>
              <select
                id={riskId}
                value={selectedRiskLevel}
                onChange={(e) => setSelectedRiskLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
                aria-label="Filter by risk level"
              >
                <option value="">All Risk Levels</option>
                {riskLevels.map(level => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Sort Options */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          {sortOptions.map(option => (
            <button
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={`px-3 py-2 text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px] ${
                sortBy === option.value
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-label={`Sort by ${option.label} ${sortBy === option.value ? (sortOrder === 'asc' ? 'ascending' : 'descending') : ''}`}
              aria-pressed={sortBy === option.value}
            >
              {option.label}
              {sortBy === option.value && (
                <span className="ml-1" aria-hidden="true">
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}