'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Tag, Calendar } from 'lucide-react';
import { FAQItem } from '@/types';

interface FAQAccordionProps {
  faqItems: FAQItem[];
  searchQuery?: string;
}

interface FAQItemComponentProps {
  item: FAQItem;
  searchQuery?: string;
}

function FAQItemComponent({ item, searchQuery }: FAQItemComponentProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const highlightText = (text: string, query?: string) => {
    if (!query || !query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-3 flex-1">
          <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 pr-4">
              {highlightText(item.question, searchQuery)}
            </h3>
            <div className="flex items-center gap-4 mt-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {item.category}
              </span>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                {item.lastUpdated.toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
        )}
      </button>
      
      {isExpanded && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="ml-8">
            <p className="text-gray-700 leading-relaxed mb-4">
              {highlightText(item.answer, searchQuery)}
            </p>
            
            {item.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-400" />
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-200 text-gray-700"
                    >
                      {highlightText(tag, searchQuery)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FAQAccordion({ faqItems, searchQuery }: FAQAccordionProps) {
  return (
    <div className="space-y-4">
      {faqItems.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <HelpCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No FAQ items found matching your search.</p>
        </div>
      ) : (
        faqItems.map((item) => (
          <FAQItemComponent
            key={item.id}
            item={item}
            searchQuery={searchQuery}
          />
        ))
      )}
    </div>
  );
}