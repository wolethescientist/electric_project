'use client';

import { useState } from 'react';
import { Search, X, Filter } from 'lucide-react';

interface InfoSearchProps {
  onSearchChange: (query: string) => void;
  onCategoryFilter?: (category: string) => void;
  categories?: string[];
  placeholder?: string;
}

export default function InfoSearch({ 
  onSearchChange, 
  onCategoryFilter, 
  categories = [], 
  placeholder = "Search documentation and FAQ..." 
}: InfoSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearchChange(value);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    onCategoryFilter?.(category);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearchChange('');
  };

  const clearCategory = () => {
    setSelectedCategory('');
    onCategoryFilter?.('');
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          placeholder={placeholder}
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Filter Toggle and Category Filter */}
      {categories.length > 0 && (
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

          {selectedCategory && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Category:</span>
              <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {selectedCategory}
                <button
                  onClick={clearCategory}
                  className="ml-1 hover:text-blue-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Category Filter Dropdown */}
      {showFilters && categories.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Filter by Category</h4>
          <div className="space-y-2">
            <button
              onClick={() => handleCategoryChange('')}
              className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                selectedCategory === '' 
                  ? 'bg-blue-100 text-blue-900' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                  selectedCategory === category 
                    ? 'bg-blue-100 text-blue-900' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {(searchQuery || selectedCategory) && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Active filters:</span>
          {searchQuery && (
            <span className="px-2 py-1 bg-gray-100 rounded text-gray-800">
              Search: "{searchQuery}"
            </span>
          )}
          {selectedCategory && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
              Category: {selectedCategory}
            </span>
          )}
        </div>
      )}
    </div>
  );
}