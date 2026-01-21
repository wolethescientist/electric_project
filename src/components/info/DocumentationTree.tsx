'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, FileText, Calendar } from 'lucide-react';
import { DocumentationSection } from '@/types';

interface DocumentationTreeProps {
  sections: DocumentationSection[];
  searchQuery?: string;
}

interface DocumentationNodeProps {
  section: DocumentationSection;
  level?: number;
  searchQuery?: string;
}

function DocumentationNode({ section, level = 0, searchQuery }: DocumentationNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level === 0);
  const hasSubsections = section.subsections && section.subsections.length > 0;

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
    <div className={`${level > 0 ? 'ml-6 border-l border-gray-200 pl-4' : ''}`}>
      <div className="mb-4">
        <div 
          className={`flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors ${
            level === 0 ? 'bg-blue-50' : ''
          }`}
          onClick={() => hasSubsections && setIsExpanded(!isExpanded)}
        >
          {hasSubsections ? (
            isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )
          ) : (
            <FileText className="w-4 h-4 text-gray-400" />
          )}
          
          <h3 className={`font-semibold ${
            level === 0 ? 'text-lg text-blue-900' : 
            level === 1 ? 'text-base text-gray-800' : 'text-sm text-gray-700'
          }`}>
            {highlightText(section.title, searchQuery)}
          </h3>
          
          <div className="flex items-center gap-1 text-xs text-gray-500 ml-auto">
            <Calendar className="w-3 h-3" />
            {section.lastUpdated.toLocaleDateString()}
          </div>
        </div>
        
        <div className={`mt-2 ${level > 0 ? 'ml-6' : 'ml-6'}`}>
          <p className="text-gray-600 leading-relaxed">
            {highlightText(section.content, searchQuery)}
          </p>
        </div>
      </div>
      
      {hasSubsections && isExpanded && (
        <div className="space-y-2">
          {section.subsections!.map((subsection) => (
            <DocumentationNode
              key={subsection.id}
              section={subsection}
              level={level + 1}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DocumentationTree({ sections, searchQuery }: DocumentationTreeProps) {
  return (
    <div className="space-y-6">
      {sections.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No documentation found matching your search.</p>
        </div>
      ) : (
        sections.map((section) => (
          <DocumentationNode
            key={section.id}
            section={section}
            searchQuery={searchQuery}
          />
        ))
      )}
    </div>
  );
}