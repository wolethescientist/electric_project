import { RegulationItem } from '@/types';
import { CheckCircle, AlertTriangle, Clock, AlertCircle, ChevronRight } from 'lucide-react';
import { handleKeyboardNavigation } from '@/utils/accessibility';

interface RegulationItemCardProps {
  item: RegulationItem;
  onClick: (item: RegulationItem) => void;
}

export default function RegulationItemCard({ item, onClick }: RegulationItemCardProps) {
  const getStatusIcon = (status: RegulationItem['status']) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="w-5 h-5 text-green-600" aria-hidden="true" />;
      case 'non-compliant':
        return <AlertCircle className="w-5 h-5 text-red-600" aria-hidden="true" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" aria-hidden="true" />;
      case 'under-review':
        return <AlertTriangle className="w-5 h-5 text-orange-600" aria-hidden="true" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" aria-hidden="true" />;
    }
  };

  const getStatusColor = (status: RegulationItem['status']) => {
    switch (status) {
      case 'compliant':
        return 'border-green-200 bg-green-50';
      case 'non-compliant':
        return 'border-red-200 bg-red-50';
      case 'pending':
        return 'border-yellow-200 bg-yellow-50';
      case 'under-review':
        return 'border-orange-200 bg-orange-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getStatusText = (status: RegulationItem['status']) => {
    switch (status) {
      case 'compliant':
        return 'Compliant';
      case 'non-compliant':
        return 'Non-Compliant';
      case 'pending':
        return 'Pending Review';
      case 'under-review':
        return 'Under Review';
      default:
        return 'Unknown';
    }
  };

  const getRiskLevelColor = (riskLevel: RegulationItem['riskLevel']) => {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplianceRateColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleClick = () => {
    onClick(item);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    handleKeyboardNavigation(event, handleClick);
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md border-2 ${getStatusColor(item.status)} hover:shadow-lg transition-all duration-200 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${item.name}, ${getStatusText(item.status)}, ${item.complianceRate}% compliance rate`}
    >
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-500 truncate">{item.id}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(item.riskLevel)} whitespace-nowrap`}>
                {item.riskLevel.toUpperCase()} RISK
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-900 transition-colors line-clamp-2">
              {item.name}
            </h3>
            <p className="text-sm text-gray-600 mt-1 truncate">{item.category}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors shrink-0 ml-2" aria-hidden="true" />
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 mb-4">
          {getStatusIcon(item.status)}
          <span className="text-sm font-medium text-gray-700">
            {getStatusText(item.status)}
          </span>
        </div>

        {/* Compliance Rate */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Compliance Rate</span>
            <span className={`text-lg font-bold ${getComplianceRateColor(item.complianceRate)}`}>
              {item.complianceRate}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2" role="progressbar" aria-valuenow={item.complianceRate} aria-valuemin={0} aria-valuemax={100} aria-label={`Compliance rate: ${item.complianceRate}%`}>
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                item.complianceRate >= 90
                  ? 'bg-green-500'
                  : item.complianceRate >= 75
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${item.complianceRate}%` }}
            />
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {item.description}
        </p>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-500">
          <span>
            {item.criteria.length} criteria
          </span>
          <span>
            Updated {new Date(item.lastUpdated).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}