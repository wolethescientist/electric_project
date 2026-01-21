'use client';

import { useState, useMemo } from 'react';
import { BookOpen, HelpCircle, Users, FileText } from 'lucide-react';
import DocumentationTree from '@/components/info/DocumentationTree';
import FAQAccordion from '@/components/info/FAQAccordion';
import ContactInfo from '@/components/info/ContactInfo';
import InfoSearch from '@/components/info/InfoSearch';
import { 
  getDocumentationSections, 
  getFAQItems, 
  getContactInfo, 
  searchDocumentation, 
  searchFAQ, 
  getFAQCategories 
} from '@/data/info-utils';

type TabType = 'documentation' | 'faq' | 'contact';

export default function Info() {
  const [activeTab, setActiveTab] = useState<TabType>('documentation');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Load data
  const documentationSections = getDocumentationSections();
  const faqItems = getFAQItems();
  const contacts = getContactInfo();
  const faqCategories = getFAQCategories(faqItems);

  // Filter data based on search and category
  const filteredDocumentation = useMemo(() => {
    return searchDocumentation(searchQuery, documentationSections);
  }, [searchQuery, documentationSections]);

  const filteredFAQ = useMemo(() => {
    let filtered = searchFAQ(searchQuery, faqItems);
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    return filtered;
  }, [searchQuery, selectedCategory, faqItems]);

  const tabs = [
    {
      id: 'documentation' as TabType,
      name: 'Documentation',
      icon: BookOpen,
      count: filteredDocumentation.length
    },
    {
      id: 'faq' as TabType,
      name: 'FAQ',
      icon: HelpCircle,
      count: filteredFAQ.length
    },
    {
      id: 'contact' as TabType,
      name: 'Contact',
      icon: Users,
      count: contacts.length
    }
  ];

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Information & Resources
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl">
          Access comprehensive documentation, frequently asked questions, and contact information 
          for the Nigerian Electricity Management Services Agency (NEMSA).
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <InfoSearch
          onSearchChange={handleSearchChange}
          onCategoryFilter={activeTab === 'faq' ? handleCategoryFilter : undefined}
          categories={activeTab === 'faq' ? faqCategories : []}
          placeholder={
            activeTab === 'documentation' 
              ? "Search documentation..." 
              : activeTab === 'faq' 
                ? "Search FAQ..." 
                : "Search contacts..."
          }
        />
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSearchQuery('');
                    setSelectedCategory('');
                  }}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.name}
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[600px]">
        {activeTab === 'documentation' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Documentation</h2>
              <p className="text-gray-600">
                Comprehensive guides and regulatory information for electric meter certification and compliance.
              </p>
            </div>
            <DocumentationTree 
              sections={filteredDocumentation} 
              searchQuery={searchQuery}
            />
          </div>
        )}

        {activeTab === 'faq' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
              <p className="text-gray-600">
                Find answers to common questions about certification processes, requirements, and procedures.
              </p>
            </div>
            <FAQAccordion 
              faqItems={filteredFAQ} 
              searchQuery={searchQuery}
            />
          </div>
        )}

        {activeTab === 'contact' && (
          <ContactInfo contacts={contacts} />
        )}
      </div>
    </div>
  );
}