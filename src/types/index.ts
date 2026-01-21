// Core data models for the NEMSA Electric Meter Portal

export interface RegulationItem {
  id: string;
  name: string;
  category: string;
  status: 'compliant' | 'non-compliant' | 'pending' | 'under-review';
  complianceRate: number;
  lastUpdated: Date;
  criteria: ComplianceCriteria[];
  riskLevel: 'low' | 'medium' | 'high';
  description: string;
}

export interface ComplianceCriteria {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  requirements: string[];
  lastReviewed: Date;
  documentLinks: string[];
}

export interface MetricsData {
  overallComplianceRate: number;
  totalRegulationItems: number;
  criticalIssues: number;
  trendsData: TrendPoint[];
  categoryBreakdown: CategoryMetric[];
  lastUpdated: Date;
}

export interface TrendPoint {
  date: string;
  value: number;
  category?: string;
}

export interface CategoryMetric {
  category: string;
  complianceRate: number;
  itemCount: number;
  criticalIssues: number;
}

export interface AnalyticsData {
  historicalTrends: TimeSeriesData[];
  predictiveInsights: PredictionData[];
  comparativeAnalysis: ComparisonData[];
  riskAssessment: RiskData[];
}

export interface TimeSeriesData {
  date: string;
  value: number;
  metric: string;
}

export interface PredictionData {
  metric: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;
  timeframe: string;
}

export interface ComparisonData {
  itemA: string;
  itemB: string;
  metric: string;
  valueA: number;
  valueB: number;
  difference: number;
}

export interface RiskData {
  regulationId: string;
  riskLevel: 'low' | 'medium' | 'high';
  riskFactors: string[];
  mitigationSuggestions: string[];
}

// Information page types
export interface DocumentationSection {
  id: string;
  title: string;
  content: string;
  subsections?: DocumentationSection[];
  lastUpdated: Date;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  lastUpdated: Date;
}

export interface ContactInfo {
  department: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  office: string;
}