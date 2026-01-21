import { AnalyticsData, TimeSeriesData, PredictionData, ComparisonData, RiskData } from '@/types';
import analyticsData from './analytics-data.json';

export function getAnalyticsData(): AnalyticsData {
  return analyticsData as AnalyticsData;
}

export function getHistoricalTrends(
  metric?: string,
  dateRange?: { start: string; end: string }
): TimeSeriesData[] {
  let trends = analyticsData.historicalTrends;
  
  // Filter by metric if specified
  if (metric) {
    trends = trends.filter(trend => trend.metric === metric);
  }
  
  // Filter by date range if specified
  if (dateRange) {
    trends = trends.filter(trend => 
      trend.date >= dateRange.start && trend.date <= dateRange.end
    );
  }
  
  return trends.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getPredictiveInsights(metric?: string): PredictionData[] {
  let insights = analyticsData.predictiveInsights;
  
  if (metric) {
    insights = insights.filter(insight => insight.metric === metric);
  }
  
  return insights;
}

export function getComparativeAnalysis(metric?: string): ComparisonData[] {
  let comparisons = analyticsData.comparativeAnalysis;
  
  if (metric) {
    comparisons = comparisons.filter(comparison => comparison.metric === metric);
  }
  
  return comparisons;
}

export function getRiskAssessment(): RiskData[] {
  return analyticsData.riskAssessment.map(risk => ({
    ...risk,
    riskLevel: risk.riskLevel as 'low' | 'medium' | 'high'
  }));
}

export function getAvailableMetrics(): string[] {
  const metrics = new Set<string>();
  
  analyticsData.historicalTrends.forEach(trend => {
    metrics.add(trend.metric);
  });
  
  analyticsData.predictiveInsights.forEach(insight => {
    metrics.add(insight.metric);
  });
  
  return Array.from(metrics);
}

export function getMetricSummary(metric: string) {
  const trends = getHistoricalTrends(metric);
  const predictions = getPredictiveInsights(metric);
  
  if (trends.length === 0) {
    return null;
  }
  
  const latestValue = trends[trends.length - 1]?.value || 0;
  const earliestValue = trends[0]?.value || 0;
  const change = latestValue - earliestValue;
  const changePercentage = earliestValue !== 0 ? (change / earliestValue) * 100 : 0;
  
  const prediction = predictions.find(p => p.metric === metric);
  
  return {
    metric,
    currentValue: latestValue,
    change,
    changePercentage,
    trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
    prediction: prediction ? {
      predictedValue: prediction.predictedValue,
      confidence: prediction.confidence,
      timeframe: prediction.timeframe
    } : null
  };
}

export function getDateRangeOptions() {
  const now = new Date();
  const options = [
    {
      label: 'Last 7 Days',
      start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: now.toISOString().split('T')[0]
    },
    {
      label: 'Last 30 Days',
      start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: now.toISOString().split('T')[0]
    },
    {
      label: 'Last 90 Days',
      start: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: now.toISOString().split('T')[0]
    },
    {
      label: 'This Month',
      start: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0],
      end: now.toISOString().split('T')[0]
    },
    {
      label: 'Last Month',
      start: new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0],
      end: new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0]
    },
    {
      label: 'Year to Date',
      start: new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0],
      end: now.toISOString().split('T')[0]
    }
  ];
  
  return options;
}

// Helper function to format metric values
export function formatMetricValue(value: number, metric: string): string {
  if (metric.includes('compliance') || metric.includes('rate')) {
    return `${value.toFixed(1)}%`;
  }
  if (metric.includes('time')) {
    return `${value.toFixed(1)}h`;
  }
  if (metric.includes('issues')) {
    return Math.round(value).toString();
  }
  return value.toFixed(1);
}

// Helper function to get metric display name
export function getMetricDisplayName(metric: string): string {
  const displayNames: { [key: string]: string } = {
    'overall_compliance': 'Overall Compliance',
    'critical_issues': 'Critical Issues',
    'renewable_energy_compliance': 'Renewable Energy Compliance',
    'inspection_rate': 'Inspection Rate',
    'response_time': 'Response Time'
  };
  
  return displayNames[metric] || metric.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
}