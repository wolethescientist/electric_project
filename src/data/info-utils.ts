import { DocumentationSection, FAQItem, ContactInfo } from '@/types';
import infoData from './info-data.json';

export function getDocumentationSections(): DocumentationSection[] {
  return infoData.documentation.map(section => ({
    ...section,
    lastUpdated: new Date(section.lastUpdated),
    subsections: section.subsections?.map(subsection => ({
      ...subsection,
      lastUpdated: new Date(subsection.lastUpdated)
    }))
  }));
}

export function getFAQItems(): FAQItem[] {
  return infoData.faq.map(item => ({
    ...item,
    lastUpdated: new Date(item.lastUpdated)
  }));
}

export function getContactInfo(): ContactInfo[] {
  return infoData.contacts;
}

export function searchDocumentation(query: string, sections: DocumentationSection[]): DocumentationSection[] {
  if (!query.trim()) return sections;
  
  const searchTerm = query.toLowerCase();
  
  return sections.filter(section => {
    const matchesSection = 
      section.title.toLowerCase().includes(searchTerm) ||
      section.content.toLowerCase().includes(searchTerm);
    
    const matchesSubsections = section.subsections?.some(subsection =>
      subsection.title.toLowerCase().includes(searchTerm) ||
      subsection.content.toLowerCase().includes(searchTerm)
    );
    
    return matchesSection || matchesSubsections;
  });
}

export function searchFAQ(query: string, faqItems: FAQItem[]): FAQItem[] {
  if (!query.trim()) return faqItems;
  
  const searchTerm = query.toLowerCase();
  
  return faqItems.filter(item =>
    item.question.toLowerCase().includes(searchTerm) ||
    item.answer.toLowerCase().includes(searchTerm) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
}

export function getFAQCategories(faqItems: FAQItem[]): string[] {
  const categories = new Set(faqItems.map(item => item.category));
  return Array.from(categories).sort();
}