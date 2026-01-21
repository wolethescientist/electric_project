'use client';

import { Download, FileText, Table } from 'lucide-react';
import { MetricsData, CategoryMetric } from '@/types';

interface ExportControlsProps {
  metricsData: MetricsData;
  onExport?: (type: 'pdf' | 'csv') => void;
}

export default function ExportControls({ metricsData, onExport }: ExportControlsProps) {
  const generateCSV = () => {
    const headers = ['Category', 'Compliance Rate (%)', 'Item Count', 'Critical Issues'];
    const rows = metricsData.categoryBreakdown.map(item => [
      item.category,
      item.complianceRate.toFixed(1),
      item.itemCount.toString(),
      item.criticalIssues.toString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `compliance-metrics-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onExport?.('csv');
  };

  const generatePDF = () => {
    // Create a simple HTML report for PDF generation
    const reportContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Electric Meter Compliance Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .summary { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
          .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
          .metric-card { background: white; border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
          .metric-value { font-size: 24px; font-weight: bold; color: #1e40af; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f8f9fa; font-weight: bold; }
          .compliant { color: #10b981; }
          .warning { color: #f59e0b; }
          .critical { color: #ef4444; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>NEMSA Electric Meter Compliance Report</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="summary">
          <h2>Executive Summary</h2>
          <div class="metrics-grid">
            <div class="metric-card">
              <div>Overall Compliance Rate</div>
              <div class="metric-value">${metricsData.overallComplianceRate.toFixed(1)}%</div>
            </div>
            <div class="metric-card">
              <div>Total Regulation Items</div>
              <div class="metric-value">${metricsData.totalRegulationItems}</div>
            </div>
            <div class="metric-card">
              <div>Critical Issues</div>
              <div class="metric-value">${metricsData.criticalIssues}</div>
            </div>
          </div>
        </div>

        <h2>Category Breakdown</h2>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Compliance Rate</th>
              <th>Item Count</th>
              <th>Critical Issues</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${metricsData.categoryBreakdown.map(item => `
              <tr>
                <td>${item.category}</td>
                <td>${item.complianceRate.toFixed(1)}%</td>
                <td>${item.itemCount}</td>
                <td>${item.criticalIssues}</td>
                <td class="${item.complianceRate >= 90 ? 'compliant' : item.complianceRate >= 80 ? 'warning' : 'critical'}">
                  ${item.complianceRate >= 90 ? 'Compliant' : item.complianceRate >= 80 ? 'Warning' : 'Critical'}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(reportContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }

    onExport?.('pdf');
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Reports</h3>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={generateCSV}
          className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Table className="w-4 h-4 mr-2" />
          Export CSV
        </button>
        <button
          onClick={generatePDF}
          className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <FileText className="w-4 h-4 mr-2" />
          Export PDF
        </button>
      </div>
      <p className="text-sm text-gray-600 mt-3">
        Export compliance data and metrics for reporting and analysis purposes.
      </p>
    </div>
  );
}