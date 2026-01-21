import { RegulationItem, MetricsData, AnalyticsData, ComplianceCriteria } from '../types';

// Import JSON data
import regulationItemsData from './regulation-items.json';
import metricsData from './metrics-data.json';
import analyticsData from './analytics-data.json';

/**
 * Data loading utilities for the NEMSA Electric Meter Portal
 */

/**
 * Load all regulation items with proper date parsing
 */
export function loadRegulationItems(): RegulationItem[] {
  return (regulationItemsData as any[]).map((item: any) => ({
    ...item,
    lastUpdated: new Date(item.lastUpdated),
    criteria: item.criteria.map((criterion: any) => ({
      ...criterion,
      lastReviewed: new Date(criterion.lastReviewed)
    }))
  })) as RegulationItem[];
}

/**
 * Load metrics data with proper date parsing
 */
export function loadMetricsData(): MetricsData {
  return {
    ...(metricsData as any),
    lastUpdated: new Date((metricsData as any).lastUpdated)
  } as MetricsData;
}

/**
 * Load analytics data
 */
export function loadAnalyticsData(): AnalyticsData {
  return analyticsData as AnalyticsData;
}

/**
 * Get regulation item by ID
 */
export function getRegulationItemById(id: string): RegulationItem | undefined {
  const items = loadRegulationItems();
  return items.find(item => item.id === id);
}

/**
 * Filter regulation items by status
 */
export function filterRegulationItemsByStatus(
  status: RegulationItem['status']
): RegulationItem[] {
  const items = loadRegulationItems();
  return items.filter(item => item.status === status);
}

/**
 * Filter regulation items by category
 */
export function filterRegulationItemsByCategory(category: string): RegulationItem[] {
  const items = loadRegulationItems();
  return items.filter(item => item.category === category);
}

/**
 * Get regulation items by risk level
 */
export function getRegulationItemsByRiskLevel(
  riskLevel: RegulationItem['riskLevel']
): RegulationItem[] {
  const items = loadRegulationItems();
  return items.filter(item => item.riskLevel === riskLevel);
}

/**
 * Search regulation items by name or description
 */
export function searchRegulationItems(query: string): RegulationItem[] {
  const items = loadRegulationItems();
  const lowercaseQuery = query.toLowerCase();
  
  return items.filter(item => 
    item.name.toLowerCase().includes(lowercaseQuery) ||
    item.description.toLowerCase().includes(lowercaseQuery) ||
    item.category.toLowerCase().includes(lowercaseQuery)
  );
}

/**
 * Get all unique categories from regulation items
 */
export function getUniqueCategories(): string[] {
  const items = loadRegulationItems();
  const categories = items.map(item => item.category);
  return Array.from(new Set(categories)).sort();
}

/**
 * Calculate compliance statistics
 */
export function calculateComplianceStats() {
  const items = loadRegulationItems();
  const total = items.length;
  const compliant = items.filter(item => item.status === 'compliant').length;
  const nonCompliant = items.filter(item => item.status === 'non-compliant').length;
  const pending = items.filter(item => item.status === 'pending').length;
  const underReview = items.filter(item => item.status === 'under-review').length;
  
  return {
    total,
    compliant,
    nonCompliant,
    pending,
    underReview,
    complianceRate: (compliant / total) * 100
  };
}

// Validation functions

/**
 * Validate RegulationItem structure
 */
export function validateRegulationItem(item: any): item is RegulationItem {
  return (
    typeof item === 'object' &&
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.category === 'string' &&
    ['compliant', 'non-compliant', 'pending', 'under-review'].includes(item.status) &&
    typeof item.complianceRate === 'number' &&
    item.complianceRate >= 0 &&
    item.complianceRate <= 100 &&
    item.lastUpdated instanceof Date &&
    Array.isArray(item.criteria) &&
    ['low', 'medium', 'high'].includes(item.riskLevel) &&
    typeof item.description === 'string'
  );
}

/**
 * Validate ComplianceCriteria structure
 */
export function validateComplianceCriteria(criteria: any): criteria is ComplianceCriteria {
  return (
    typeof criteria === 'object' &&
    typeof criteria.id === 'string' &&
    typeof criteria.title === 'string' &&
    typeof criteria.description === 'string' &&
    ['critical', 'high', 'medium', 'low'].includes(criteria.priority) &&
    typeof criteria.category === 'string' &&
    Array.isArray(criteria.requirements) &&
    criteria.requirements.every((req: any) => typeof req === 'string') &&
    criteria.lastReviewed instanceof Date &&
    Array.isArray(criteria.documentLinks) &&
    criteria.documentLinks.every((link: any) => typeof link === 'string')
  );
}

/**
 * Validate MetricsData structure
 */
export function validateMetricsData(data: any): data is MetricsData {
  return (
    typeof data === 'object' &&
    typeof data.overallComplianceRate === 'number' &&
    data.overallComplianceRate >= 0 &&
    data.overallComplianceRate <= 100 &&
    typeof data.totalRegulationItems === 'number' &&
    data.totalRegulationItems >= 0 &&
    typeof data.criticalIssues === 'number' &&
    data.criticalIssues >= 0 &&
    Array.isArray(data.trendsData) &&
    Array.isArray(data.categoryBreakdown) &&
    data.lastUpdated instanceof Date
  );
}

/**
 * Validate data integrity across all datasets
 */
export function validateDataIntegrity(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  try {
    // Validate regulation items
    const items = loadRegulationItems();
    for (let i = 0; i < items.length; i++) {
      const item = items[i] as any;
      if (!validateRegulationItem(item)) {
        errors.push(`Invalid regulation item at index ${i}: ${item?.id || 'unknown'}`);
      }
      
      // Validate criteria within each item
      if (item && item.criteria && Array.isArray(item.criteria)) {
        for (let j = 0; j < item.criteria.length; j++) {
          const criterion = item.criteria[j];
          if (!validateComplianceCriteria(criterion)) {
            errors.push(`Invalid criteria at index ${j} for item ${item?.id || 'unknown'}`);
          }
        }
      }
    }
    
    // Validate metrics data
    const metrics = loadMetricsData();
    if (!validateMetricsData(metrics)) {
      errors.push('Invalid metrics data structure');
    }
    
    // Check if total regulation items matches actual count
    if (metrics.totalRegulationItems !== items.length) {
      errors.push(`Metrics total (${metrics.totalRegulationItems}) doesn't match actual items count (${items.length})`);
    }
    
    // Validate analytics data exists
    const analytics = loadAnalyticsData();
    if (!analytics || typeof analytics !== 'object') {
      errors.push('Invalid analytics data structure');
    }
    
  } catch (error) {
    errors.push(`Data loading error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}