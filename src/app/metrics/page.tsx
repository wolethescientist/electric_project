'use client';

import { useState } from 'react';
import KPICard from '@/components/metrics/KPICard';
import ComplianceChart from '@/components/metrics/ComplianceChart';
import TrendChart from '@/components/metrics/TrendChart';
import ExportControls from '@/components/metrics/ExportControls';
import { 
  getMetricsData, 
  calculateTrendDirection, 
  getComplianceStatus,
  getCriticalCategories,
  formatLastUpdated
} from '@/data/metrics-utils';

export default function Metrics() {
  const [exportCount, setExportCount] = useState(0);
  const metricsData = getMetricsData();
  const trendData = calculateTrendDirection(metricsData.trendsData);
  const criticalCategories = getCriticalCategories(metricsData.categoryBreakdown);

  const handleExport = (type: 'pdf' | 'csv') => {
    setExportCount(prev => prev + 1);
    // Could add analytics tracking here
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Performance Metrics
        </h1>
        <p className="text-gray-600">
          Monitor compliance rates, track trends, and analyze regulatory performance across all electric meter categories.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {formatLastUpdated(metricsData.lastUpdated)}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Overall Compliance Rate"
          value={`${metricsData.overallComplianceRate.toFixed(1)}%`}
          trend={{
            direction: trendData.direction,
            percentage: trendData.percentage,
            period: 'last period'
          }}
          status={getComplianceStatus(metricsData.overallComplianceRate)}
          description="Average across all categories"
        />
        
        <KPICard
          title="Total Regulation Items"
          value={metricsData.totalRegulationItems}
          description="Active regulatory categories"
        />
        
        <KPICard
          title="Critical Issues"
          value={metricsData.criticalIssues}
          status={metricsData.criticalIssues > 5 ? 'critical' : metricsData.criticalIssues > 2 ? 'warning' : 'good'}
          description="Requiring immediate attention"
        />
        
        <KPICard
          title="Categories at Risk"
          value={criticalCategories.length}
          status={criticalCategories.length > 3 ? 'critical' : criticalCategories.length > 1 ? 'warning' : 'good'}
          description="Below 80% compliance"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Compliance Rate Chart */}
        <div className="lg:col-span-2">
          <ComplianceChart 
            data={metricsData.categoryBreakdown}
            title="Compliance Rate by Category"
            height={400}
          />
        </div>
        
        {/* Trend Chart */}
        <div className="lg:col-span-2">
          <TrendChart 
            data={metricsData.trendsData}
            title="Overall Compliance Trend (Last 10 Days)"
            height={300}
            color="#1e40af"
          />
        </div>
      </div>

      {/* Critical Categories Alert */}
      {criticalCategories.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-red-800 mb-3">
            Categories Requiring Attention ({criticalCategories.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {criticalCategories.map(category => (
              <div key={category.category} className="bg-white p-4 rounded border">
                <h4 className="font-medium text-gray-900">{category.category}</h4>
                <p className="text-sm text-red-600">
                  {category.complianceRate.toFixed(1)}% compliance
                </p>
                {category.criticalIssues > 0 && (
                  <p className="text-sm text-red-600">
                    {category.criticalIssues} critical issue{category.criticalIssues > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Export Controls */}
      <ExportControls 
        metricsData={metricsData}
        onExport={handleExport}
      />

      {/* Summary Statistics */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Compliance Distribution</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Excellent (≥90%)</span>
                <span className="text-sm font-medium">
                  {metricsData.categoryBreakdown.filter(c => c.complianceRate >= 90).length} categories
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Good (80-89%)</span>
                <span className="text-sm font-medium">
                  {metricsData.categoryBreakdown.filter(c => c.complianceRate >= 80 && c.complianceRate < 90).length} categories
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Needs Improvement (&lt;80%)</span>
                <span className="text-sm font-medium">
                  {metricsData.categoryBreakdown.filter(c => c.complianceRate < 80).length} categories
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Top Performers</h4>
            <div className="space-y-2">
              {metricsData.categoryBreakdown
                .sort((a, b) => b.complianceRate - a.complianceRate)
                .slice(0, 3)
                .map(category => (
                  <div key={category.category} className="flex justify-between">
                    <span className="text-sm text-gray-600 truncate mr-2">
                      {category.category}
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      {category.complianceRate.toFixed(1)}%
                    </span>
                  </div>
                ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Recent Activity</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Reports Exported</span>
                <span className="text-sm font-medium">{exportCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Last Data Update</span>
                <span className="text-sm font-medium">
                  {metricsData.lastUpdated.toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}