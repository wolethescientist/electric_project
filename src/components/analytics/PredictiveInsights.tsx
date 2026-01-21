'use client';

import { PredictionData } from '@/types';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface PredictiveInsightsProps {
  data: PredictionData[];
}

export default function PredictiveInsights({ data }: PredictiveInsightsProps) {
  const getMetricLabel = (metric: string) => {
    const labels: { [key: string]: string } = {
      'overall_compliance': 'Overall Compliance',
      'critical_issues': 'Critical Issues',
      'renewable_energy_compliance': 'Renewable Energy Compliance',
      'inspection_rate': 'Inspection Rate',
      'response_time': 'Response Time'
    };
    return labels[metric] || metric.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getTimeframeLabel = (timeframe: string) => {
    const labels: { [key: string]: string } = {
      'next_30_days': 'Next 30 Days',
      'next_60_days': 'Next 60 Days',
      'next_90_days': 'Next 90 Days',
      'next_quarter': 'Next Quarter'
    };
    return labels[timeframe] || timeframe.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-50';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.8) return CheckCircle;
    if (confidence >= 0.6) return Clock;
    return AlertTriangle;
  };

  const getTrendDirection = (current: number, predicted: number, metric: string) => {
    // For metrics where higher is better (compliance rates)
    const higherIsBetter = metric.includes('compliance') || metric.includes('rate');
    // For metrics where lower is better (critical issues, response time)
    const lowerIsBetter = metric.includes('issues') || metric.includes('time');
    
    const change = predicted - current;
    const isImproving = (higherIsBetter && change > 0) || (lowerIsBetter && change < 0);
    
    return {
      isImproving,
      change: Math.abs(change),
      percentage: Math.abs((change / current) * 100)
    };
  };

  const formatValue = (value: number, metric: string) => {
    if (metric.includes('compliance') || metric.includes('rate')) {
      return `${value.toFixed(1)}%`;
    }
    if (metric.includes('time')) {
      return `${value.toFixed(1)}h`;
    }
    return value.toFixed(1);
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Predictive Insights</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>AI-powered forecasting</span>
        </div>
      </div>

      {/* Prediction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((prediction, index) => {
          const trend = getTrendDirection(prediction.currentValue, prediction.predictedValue, prediction.metric);
          const TrendIcon = trend.isImproving ? TrendingUp : TrendingDown;
          const trendColor = trend.isImproving ? 'text-green-600' : 'text-red-600';
          const ConfidenceIcon = getConfidenceIcon(prediction.confidence);
          
          return (
            <div key={index} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">
                    {getMetricLabel(prediction.metric)}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {getTimeframeLabel(prediction.timeframe)}
                  </p>
                </div>
                <div className={`p-1 rounded-full ${getConfidenceColor(prediction.confidence)}`}>
                  <ConfidenceIcon className="h-4 w-4" />
                </div>
              </div>

              {/* Current vs Predicted Values */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {formatValue(prediction.currentValue, prediction.metric)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Predicted</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-gray-900">
                      {formatValue(prediction.predictedValue, prediction.metric)}
                    </span>
                    <TrendIcon className={`h-4 w-4 ${trendColor}`} />
                  </div>
                </div>
              </div>

              {/* Change Indicator */}
              <div className={`p-3 rounded-lg ${trend.isImproving ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${trendColor}`}>
                    {trend.isImproving ? 'Expected Improvement' : 'Potential Decline'}
                  </span>
                  <span className={`text-sm font-semibold ${trendColor}`}>
                    {trend.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="mt-1">
                  <div className={`h-2 rounded-full ${trend.isImproving ? 'bg-green-200' : 'bg-red-200'}`}>
                    <div 
                      className={`h-2 rounded-full ${trend.isImproving ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(trend.percentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Confidence Level */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Confidence Level</span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getConfidenceColor(prediction.confidence)}`}>
                    {(prediction.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Insights */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Key Insights</h4>
        <div className="space-y-2 text-sm text-blue-800">
          {data.filter(p => getTrendDirection(p.currentValue, p.predictedValue, p.metric).isImproving).length > 0 && (
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span>
                {data.filter(p => getTrendDirection(p.currentValue, p.predictedValue, p.metric).isImproving).length} metrics 
                showing positive trends
              </span>
            </div>
          )}
          
          {data.filter(p => !getTrendDirection(p.currentValue, p.predictedValue, p.metric).isImproving).length > 0 && (
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <span>
                {data.filter(p => !getTrendDirection(p.currentValue, p.predictedValue, p.metric).isImproving).length} metrics 
                may need attention
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-blue-600" />
            <span>
              Average prediction confidence: {((data.reduce((sum, p) => sum + p.confidence, 0) / data.length) * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Recommended Actions</h4>
        <div className="space-y-2 text-sm text-gray-700">
          {data
            .filter(p => !getTrendDirection(p.currentValue, p.predictedValue, p.metric).isImproving)
            .map((prediction, index) => (
              <div key={index} className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <span>
                  Monitor {getMetricLabel(prediction.metric).toLowerCase()} closely - 
                  predicted decline of {getTrendDirection(prediction.currentValue, prediction.predictedValue, prediction.metric).percentage.toFixed(1)}% 
                  in {getTimeframeLabel(prediction.timeframe).toLowerCase()}
                </span>
              </div>
            ))}
          
          {data.filter(p => !getTrendDirection(p.currentValue, p.predictedValue, p.metric).isImproving).length === 0 && (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>All metrics showing positive trends - maintain current strategies</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}