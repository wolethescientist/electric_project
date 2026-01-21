'use client';

import { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

interface DateRange {
  start: string;
  end: string;
  label: string;
}

interface DateRangeSelectorProps {
  onDateRangeChange: (dateRange: DateRange | null) => void;
  selectedRange?: DateRange | null;
}

export default function DateRangeSelector({ onDateRangeChange, selectedRange }: DateRangeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  // Predefined date ranges
  const predefinedRanges: DateRange[] = [
    {
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
      label: 'Last 7 Days'
    },
    {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
      label: 'Last 30 Days'
    },
    {
      start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
      label: 'Last 90 Days'
    },
    {
      start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
      label: 'This Month'
    },
    {
      start: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().split('T')[0],
      end: new Date(new Date().getFullYear(), new Date().getMonth(), 0).toISOString().split('T')[0],
      label: 'Last Month'
    },
    {
      start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
      label: 'Year to Date'
    }
  ];

  const handleRangeSelect = (range: DateRange) => {
    onDateRangeChange(range);
    setIsOpen(false);
    setShowCustom(false);
  };

  const handleCustomRangeApply = () => {
    if (customStart && customEnd) {
      const customRange: DateRange = {
        start: customStart,
        end: customEnd,
        label: `${new Date(customStart).toLocaleDateString()} - ${new Date(customEnd).toLocaleDateString()}`
      };
      onDateRangeChange(customRange);
      setIsOpen(false);
      setShowCustom(false);
    }
  };

  const handleClearRange = () => {
    onDateRangeChange(null);
    setIsOpen(false);
    setShowCustom(false);
    setCustomStart('');
    setCustomEnd('');
  };

  const formatDateRange = (range: DateRange) => {
    const startDate = new Date(range.start);
    const endDate = new Date(range.end);
    
    if (range.label.includes('Custom') || range.label.includes(' - ')) {
      return range.label;
    }
    
    return `${startDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })} - ${endDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })}`;
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        <Calendar className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">
          {selectedRange ? formatDateRange(selectedRange) : 'Select Date Range'}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4">
            {/* Predefined Ranges */}
            {!showCustom && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Select</h4>
                {predefinedRanges.map((range, index) => (
                  <button
                    key={index}
                    onClick={() => handleRangeSelect(range)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors ${
                      selectedRange && 
                      selectedRange.start === range.start && 
                      selectedRange.end === range.end
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
                
                {/* Custom Range Button */}
                <button
                  onClick={() => setShowCustom(true)}
                  className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  Custom Range...
                </button>
                
                {/* Clear Selection */}
                {selectedRange && (
                  <button
                    onClick={handleClearRange}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    Clear Selection
                  </button>
                )}
              </div>
            )}

            {/* Custom Range Inputs */}
            {showCustom && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">Custom Date Range</h4>
                  <button
                    onClick={() => setShowCustom(false)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Back
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={customStart}
                      onChange={(e) => setCustomStart(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      max={customEnd || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={customEnd}
                      onChange={(e) => setCustomEnd(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min={customStart}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleCustomRangeApply}
                    disabled={!customStart || !customEnd}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => {
                      setShowCustom(false);
                      setCustomStart('');
                      setCustomEnd('');
                    }}
                    className="px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}