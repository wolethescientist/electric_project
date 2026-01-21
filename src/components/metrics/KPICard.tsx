'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    percentage: number;
    period: string;
  };
  progress?: {
    current: number;
    target: number;
    unit?: string;
  };
  status?: 'good' | 'warning' | 'critical';
  description?: string;
}

export default function KPICard({ 
  title, 
  value, 
  trend, 
  progress, 
  status = 'good',
  description 
}: KPICardProps) {
  const getTrendIcon = () => {
    if (!trend) return null;
    
    switch (trend.direction) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" aria-hidden="true" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" aria-hidden="true" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" aria-hidden="true" />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return 'text-gray-600';
    
    switch (trend.direction) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'good':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'critical':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  const getProgressPercentage = () => {
    if (!progress) return 0;
    return Math.min((progress.current / progress.target) * 100, 100);
  };

  const getProgressColor = () => {
    const percentage = getProgressPercentage();
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTrendAriaLabel = () => {
    if (!trend) return '';
    const direction = trend.direction === 'up' ? 'increased' : trend.direction === 'down' ? 'decreased' : 'remained stable';
    return `Trend: ${direction} by ${Math.abs(trend.percentage)}% compared to ${trend.period}`;
  };

  return (
    <div 
      className={`p-4 sm:p-6 rounded-lg border-2 ${getStatusColor()} transition-all hover:shadow-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2`}
      role="region"
      aria-labelledby={`kpi-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 
          id={`kpi-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
          className="text-sm font-medium text-gray-700 uppercase tracking-wide"
        >
          {title}
        </h3>
        {trend && (
          <div 
            className={`flex items-center space-x-1 ${getTrendColor()}`}
            aria-label={getTrendAriaLabel()}
          >
            {getTrendIcon()}
            <span className="text-sm font-medium">
              {trend.percentage > 0 ? '+' : ''}{trend.percentage}%
            </span>
          </div>
        )}
      </div>

      <div className="mb-4">
        <div 
          className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1"
          aria-label={`Current value: ${typeof value === 'number' ? value.toLocaleString() : value}`}
        >
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
        {trend && (
          <p className="text-xs text-gray-500 mt-1">
            vs. {trend.period}
          </p>
        )}
      </div>

      {progress && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">
              {progress.current}{progress.unit} / {progress.target}{progress.unit}
            </span>
          </div>
          <div 
            className="w-full bg-gray-200 rounded-full h-2" 
            role="progressbar" 
            aria-valuenow={progress.current} 
            aria-valuemin={0} 
            aria-valuemax={progress.target}
            aria-label={`Progress: ${progress.current} of ${progress.target} ${progress.unit || 'units'}`}
          >
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
          <div className="text-xs text-gray-500">
            {getProgressPercentage().toFixed(1)}% complete
          </div>
        </div>
      )}
    </div>
  );
}