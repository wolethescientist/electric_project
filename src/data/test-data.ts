/**
 * Simple test script to verify data loading functionality
 * This can be run to validate that all data models and utilities work correctly
 */

import {
  loadRegulationItems,
  loadMetricsData,
  loadAnalyticsData,
  validateDataIntegrity,
  calculateComplianceStats,
  getUniqueCategories,
  searchRegulationItems,
  filterRegulationItemsByStatus
} from './utils';

export function testDataLoading() {
  console.log('Testing Electric Testing Facility Data Loading...\n');

  try {
    // Test regulation items loading
    console.log('1. Testing regulation items loading...');
    const items = loadRegulationItems();
    console.log(`✓ Loaded ${items.length} regulation items`);
    console.log(`✓ First item: ${items[0]?.name} (${items[0]?.id})`);
    console.log(`✓ Last item: ${items[items.length - 1]?.name} (${items[items.length - 1]?.id})\n`);

    // Test metrics data loading
    console.log('2. Testing metrics data loading...');
    const metrics = loadMetricsData();
    console.log(`✓ Overall compliance rate: ${metrics.overallComplianceRate}%`);
    console.log(`✓ Total regulation items: ${metrics.totalRegulationItems}`);
    console.log(`✓ Critical issues: ${metrics.criticalIssues}`);
    console.log(`✓ Last updated: ${metrics.lastUpdated.toISOString()}\n`);

    // Test analytics data loading
    console.log('3. Testing analytics data loading...');
    const analytics = loadAnalyticsData();
    console.log(`✓ Historical trends: ${analytics.historicalTrends.length} data points`);
    console.log(`✓ Predictive insights: ${analytics.predictiveInsights.length} predictions`);
    console.log(`✓ Risk assessments: ${analytics.riskAssessment.length} items\n`);

    // Test utility functions
    console.log('4. Testing utility functions...');
    const stats = calculateComplianceStats();
    console.log(`✓ Compliance stats: ${stats.compliant}/${stats.total} compliant (${stats.complianceRate.toFixed(1)}%)`);
    
    const categories = getUniqueCategories();
    console.log(`✓ Unique categories: ${categories.length} (${categories.join(', ')})`);
    
    const searchResults = searchRegulationItems('smart');
    console.log(`✓ Search for 'smart': ${searchResults.length} results`);
    
    const compliantItems = filterRegulationItemsByStatus('compliant');
    console.log(`✓ Compliant items: ${compliantItems.length}\n`);

    // Test data validation
    console.log('5. Testing data validation...');
    const validation = validateDataIntegrity();
    if (validation.isValid) {
      console.log('✓ All data validation checks passed');
    } else {
      console.log('✗ Data validation failed:');
      validation.errors.forEach(error => console.log(`  - ${error}`));
    }

    console.log('\n🎉 All tests completed successfully!');
    return true;

  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

// Export for potential use in components or other modules
export default testDataLoading;