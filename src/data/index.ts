/**
 * Data module exports for the Electric Testing Facility
 */

// Export all utility functions
export {
  loadRegulationItems,
  loadMetricsData,
  loadAnalyticsData,
  getRegulationItemById,
  filterRegulationItemsByStatus,
  filterRegulationItemsByCategory,
  getRegulationItemsByRiskLevel,
  searchRegulationItems,
  getUniqueCategories,
  calculateComplianceStats,
  validateRegulationItem,
  validateComplianceCriteria,
  validateMetricsData,
  validateDataIntegrity
} from './utils';

// Export data files for direct access if needed
export { default as regulationItemsData } from './regulation-items.json';
export { default as metricsData } from './metrics-data.json';
export { default as analyticsData } from './analytics-data.json';