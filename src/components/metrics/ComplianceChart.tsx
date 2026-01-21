'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CategoryMetric } from '@/types';

interface ComplianceChartProps {
  data: CategoryMetric[];
  title?: string;
  height?: number;
}

export default function ComplianceChart({ 
  data, 
  title = "Compliance Rate by Category",
  height = 400 
}: ComplianceChartProps) {
  // Color coding based on compliance rate
  const getBarColor = (rate: number) => {
    if (rate >= 90) return '#10b981'; // Green
    if (rate >= 80) return '#f59e0b'; // Yellow
    if (rate >= 70) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  // Format data for the chart
  const chartData = data.map(item => ({
    ...item,
    displayName: item.category.length > 12 ? 
      item.category.substring(0, 12) + '...' : 
      item.category
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.category}</p>
          <p className="text-sm text-gray-600">
            Compliance Rate: <span className="font-medium">{data.complianceRate.toFixed(1)}%</span>
          </p>
          <p className="text-sm text-gray-600">
            Items: <span className="font-medium">{data.itemCount}</span>
          </p>
          <p className="text-sm text-gray-600">
            Critical Issues: <span className="font-medium text-red-600">{data.criticalIssues}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey="displayName"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
          />
          <YAxis 
            domain={[0, 100]}
            tick={{ fontSize: 12 }}
            label={{ value: 'Compliance Rate (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="complianceRate" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.complianceRate)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}