import { MetricsData, TrendPoint, CategoryMetric } from '@/types';
import metricsData from './metrics-data.json';

export function getMetricsData(): MetricsData {
  return {
    ...metricsData,
    lastUpdated: new Date(metricsData.lastUpdated)
  };
}

export function calculateTrendDirection(data: TrendPoint[]): {
  direction: 'up' | 'down' | 'neutral';
  percentage: number;
} {
  if (data.length < 2) {
    return { direction: 'neutral', percentage: 0 };
  }

  const latest = data[data.length - 1].value;
  const previous = data[data.length - 2].value;
  const change = ((latest - previous) / previous) * 100;

  if (Math.abs(change) < 0.1) {
    return { direction: 'neutral', percentage: 0 };
  }

  return {
    direction: change > 0 ? 'up' : 'down',
    percentage: Math.abs(change)
  };
}

export function getComplianceStatus(rate: number): 'good' | 'warning' | 'critical' {
  if (rate >= 90) return 'good';
  if (rate >= 80) return 'warning';
  return 'critical';
}

export function getCriticalCategories(categories: CategoryMetric[]): CategoryMetric[] {
  return categories.filter(cat => cat.criticalIssues > 0 || cat.complianceRate < 80);
}

export function getTopPerformingCategories(categories: CategoryMetric[], limit = 5): CategoryMetric[] {
  return [...categories]
    .sort((a, b) => b.complianceRate - a.complianceRate)
    .slice(0, limit);
}

export function calculateAverageComplianceRate(categories: CategoryMetric[]): number {
  if (categories.length === 0) return 0;
  
  const totalRate = categories.reduce((sum, cat) => sum + cat.complianceRate, 0);
  return totalRate / categories.length;
}

export function formatLastUpdated(date: Date): string {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return 'Updated just now';
  } else if (diffInHours < 24) {
    return `Updated ${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `Updated ${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
}