'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ComparisonData } from '@/types';
import { ArrowUp, ArrowDown, Equal } from 'lucide-react';

interface ComparativeAnalysisProps {
  data: ComparisonData[];
}

export default function ComparativeAnalysis({ data }: ComparativeAnalysisProps) {
  const [selectedMetric, setSelectedMetric] = useState<string>('compliance_rate');
  
  // Get unique metrics from data
  const availableMetrics = Array.from(new Set(data.map(d => d.metric)));
  
  // Filter data by selected metric
  const filteredData = data.filter(d => d.metric === selectedMetric);
  
  // Prepare chart data
  const chartData = filteredData.map(item => ({
    comparison: `${item.itemA.substring(0, 15)}... vs ${item.itemB.substring(0, 15)}...`,
    fullItemA: item.itemA,
    fullItemB: item.itemB,
    valueA: item.valueA,
    valueB: item.valueB,
    difference: item.difference,
    higher: item.valueA > item.valueB ? 'A' : 'B'
  }));

  const getMetricLabel = (metric: string) => {
    const labels: { [key: string]: string } = {
      'compliance_rate': 'Compliance Rate (%)',
      'inspection_frequency': 'Inspection Frequency',
      'response_time': 'Response Time (hours)',
      'cost_efficiency': 'Cost Efficiency Score'
    };
    return labels[metric] || metric.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg max-w-xs">
          <div className="space-y-2">
            <p className="font-medium text-gray-900 text-sm">Comparison Details</p>
            <div className="space-y-1">
              <p className="text-sm text-blue-600">
                <span className="font-medium">{data.fullItemA}</span>
                <br />
                <span className="text-lg font-semibold">{data.valueA.toFixed(1)}%</span>
              </p>
              <p className="text-sm text-orange-600">
                <span className="font-medium">{data.fullItemB}</span>
                <br />
                <span className="text-lg font-semibold">{data.valueB.toFixed(1)}%</span>
              </p>
              <div className="flex items-center gap-1 pt-1 border-t">
                {data.difference > 0 ? (
                  <ArrowUp className="h-3 w-3 text-green-600" />
                ) : data.difference < 0 ? (
                  <ArrowDown className="h-3 w-3 text-red-600" />
                ) : (
                  <Equal className="h-3 w-3 text-gray-600" />
                )}
                <span className="text-sm font-medium">
                  Difference: {Math.abs(data.difference).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 lg:mb-0">Comparative Analysis</h3>
        
        {/* Metric Selection */}
        <div className="flex flex-wrap gap-2">
          {availableMetrics.map(metric => (
            <button
              key={metric}
              onClick={() => setSelectedMetric(metric)}
              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                selectedMetric === metric
                  ? 'bg-blue-100 border-blue-300 text-blue-800'
                  : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {getMetricLabel(metric)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-green-800 mb-1">Highest Performer</h4>
          <p className="text-lg font-semibold text-green-900">
            {filteredData.reduce((max, item) => 
              Math.max(item.valueA, item.valueB) > Math.max(max.valueA, max.valueB) ? item : max
            , filteredData[0])?.valueA > filteredData.reduce((max, item) => 
              Math.max(item.valueA, item.valueB) > Math.max(max.valueA, max.valueB) ? item : max
            , filteredData[0])?.valueB ? 
              filteredData.reduce((max, item) => 
                Math.max(item.valueA, item.valueB) > Math.max(max.valueA, max.valueB) ? item : max
              , filteredData[0])?.itemA.substring(0, 20) + '...' :
              filteredData.reduce((max, item) => 
                Math.max(item.valueA, item.valueB) > Math.max(max.valueA, max.valueB) ? item : max
              , filteredData[0])?.itemB.substring(0, 20) + '...'
            }
          </p>
          <p className="text-sm text-green-700">
            {Math.max(...filteredData.map(item => Math.max(item.valueA, item.valueB))).toFixed(1)}%
          </p>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-red-800 mb-1">Needs Attention</h4>
          <p className="text-lg font-semibold text-red-900">
            {filteredData.reduce((min, item) => 
              Math.min(item.valueA, item.valueB) < Math.min(min.valueA, min.valueB) ? item : min
            , filteredData[0])?.valueA < filteredData.reduce((min, item) => 
              Math.min(item.valueA, item.valueB) < Math.min(min.valueA, min.valueB) ? item : min
            , filteredData[0])?.valueB ? 
              filteredData.reduce((min, item) => 
                Math.min(item.valueA, item.valueB) < Math.min(min.valueA, min.valueB) ? item : min
              , filteredData[0])?.itemA.substring(0, 20) + '...' :
              filteredData.reduce((min, item) => 
                Math.min(item.valueA, item.valueB) < Math.min(min.valueA, min.valueB) ? item : min
              , filteredData[0])?.itemB.substring(0, 20) + '...'
            }
          </p>
          <p className="text-sm text-red-700">
            {Math.min(...filteredData.map(item => Math.min(item.valueA, item.valueB))).toFixed(1)}%
          </p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-1">Largest Gap</h4>
          <p className="text-lg font-semibold text-blue-900">
            {filteredData.reduce((max, item) => 
              Math.abs(item.difference) > Math.abs(max.difference) ? item : max
            , filteredData[0])?.difference > 0 ? 
              filteredData.reduce((max, item) => 
                Math.abs(item.difference) > Math.abs(max.difference) ? item : max
              , filteredData[0])?.itemA.substring(0, 15) + '...' :
              filteredData.reduce((max, item) => 
                Math.abs(item.difference) > Math.abs(max.difference) ? item : max
              , filteredData[0])?.itemB.substring(0, 15) + '...'
            }
          </p>
          <p className="text-sm text-blue-700">
            +{Math.abs(filteredData.reduce((max, item) => 
              Math.abs(item.difference) > Math.abs(max.difference) ? item : max
            , filteredData[0])?.difference || 0).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 80,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              dataKey="comparison"
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              label={{ value: getMetricLabel(selectedMetric), angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="valueA" name="Item A" fill="#3b82f6" />
            <Bar dataKey="valueB" name="Item B" fill="#f97316" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Comparison Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Regulation Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Values
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Difference
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">{item.itemA}</p>
                    <p className="text-sm text-gray-600">vs</p>
                    <p className="text-sm font-medium text-gray-900">{item.itemB}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <p className="text-sm text-blue-600 font-medium">{item.valueA.toFixed(1)}%</p>
                    <p className="text-sm text-gray-400">vs</p>
                    <p className="text-sm text-orange-600 font-medium">{item.valueB.toFixed(1)}%</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    {item.difference > 0 ? (
                      <ArrowUp className="h-4 w-4 text-green-600" />
                    ) : item.difference < 0 ? (
                      <ArrowDown className="h-4 w-4 text-red-600" />
                    ) : (
                      <Equal className="h-4 w-4 text-gray-600" />
                    )}
                    <span className={`text-sm font-medium ${
                      item.difference > 0 ? 'text-green-600' : 
                      item.difference < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {item.difference > 0 ? '+' : ''}{item.difference.toFixed(1)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}