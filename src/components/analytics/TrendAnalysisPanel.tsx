'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TimeSeriesData } from '@/types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendAnalysisPanelProps {
  data: TimeSeriesData[];
  dateRange?: { start: string; end: string };
}

export default function TrendAnalysisPanel({ data, dateRange }: TrendAnalysisPanelProps) {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['overall_compliance', 'critical_issues']);
  
  // Get unique metrics from data
  const availableMetrics = Array.from(new Set(data.map(d => d.metric)));
  
  // Filter data based on date range and selected metrics
  const filteredData = data.filter(d => {
    const inDateRange = !dateRange || (d.date >= dateRange.start && d.date <= dateRange.end);
    const inSelectedMetrics = selectedMetrics.includes(d.metric);
    return inDateRange && inSelectedMetrics;
  });

  // Group data by date for multi-line chart
  const chartData = filteredData.reduce((acc: any[], item) => {
    const existingDate = acc.find(d => d.date === item.date);
    if (existingDate) {
      existingDate[item.metric] = item.value;
    } else {
      acc.push({
        date: item.date,
        displayDate: new Date(item.date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        [item.metric]: item.value
      });
    }
    return acc;
  }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Calculate trend indicators
  const getTrendIndicator = (metric: string) => {
    const metricData = filteredData.filter(d => d.metric === metric).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    if (metricData.length < 2) return { direction: 'stable', change: 0 };
    
    const first = metricData[0].value;
    const last = metricData[metricData.length - 1].value;
    const change = ((last - first) / first) * 100;
    
    if (Math.abs(change) < 1) return { direction: 'stable', change };
    return { direction: change > 0 ? 'up' : 'down', change };
  };

  const getMetricColor = (metric: string) => {
    const colors: { [key: string]: string } = {
      'overall_compliance': '#3b82f6',
      'critical_issues': '#ef4444',
      'renewable_energy_compliance': '#10b981',
      'inspection_rate': '#f59e0b',
      'response_time': '#8b5cf6'
    };
    return colors[metric] || '#6b7280';
  };

  const getMetricLabel = (metric: string) => {
    const labels: { [key: string]: string } = {
      'overall_compliance': 'Overall Compliance (%)',
      'critical_issues': 'Critical Issues',
      'renewable_energy_compliance': 'Renewable Energy Compliance (%)',
      'inspection_rate': 'Inspection Rate (%)',
      'response_time': 'Response Time (hours)'
    };
    return labels[metric] || metric.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">
            {new Date(data.date).toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm text-gray-600">
              <span style={{ color: entry.color }}>●</span> {getMetricLabel(entry.dataKey)}: 
              <span className="font-medium ml-1">
                {entry.dataKey.includes('compliance') || entry.dataKey.includes('rate') 
                  ? `${entry.value.toFixed(1)}%` 
                  : entry.value.toFixed(1)}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 lg:mb-0">Trend Analysis</h3>
        
        {/* Metric Selection */}
        <div className="flex flex-wrap gap-2">
          {availableMetrics.map(metric => (
            <button
              key={metric}
              onClick={() => {
                if (selectedMetrics.includes(metric)) {
                  setSelectedMetrics(selectedMetrics.filter(m => m !== metric));
                } else {
                  setSelectedMetrics([...selectedMetrics, metric]);
                }
              }}
              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                selectedMetrics.includes(metric)
                  ? 'bg-blue-100 border-blue-300 text-blue-800'
                  : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {getMetricLabel(metric)}
            </button>
          ))}
        </div>
      </div>

      {/* Trend Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {selectedMetrics.map(metric => {
          const trend = getTrendIndicator(metric);
          const TrendIcon = trend.direction === 'up' ? TrendingUp : 
                           trend.direction === 'down' ? TrendingDown : Minus;
          const trendColor = trend.direction === 'up' ? 'text-green-600' : 
                           trend.direction === 'down' ? 'text-red-600' : 'text-gray-600';
          
          return (
            <div key={metric} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700 truncate">
                  {getMetricLabel(metric)}
                </h4>
                <TrendIcon className={`h-4 w-4 ${trendColor}`} />
              </div>
              <p className={`text-lg font-semibold ${trendColor} mt-1`}>
                {trend.change > 0 ? '+' : ''}{trend.change.toFixed(1)}%
              </p>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              dataKey="displayDate"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {selectedMetrics.map(metric => (
              <Line
                key={metric}
                type="monotone"
                dataKey={metric}
                stroke={getMetricColor(metric)}
                strokeWidth={2}
                dot={{ fill: getMetricColor(metric), strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, stroke: getMetricColor(metric), strokeWidth: 2 }}
                name={getMetricLabel(metric)}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}