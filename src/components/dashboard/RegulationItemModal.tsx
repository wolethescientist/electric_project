import React, { useState, useMemo } from 'react';
import { X, ExternalLink, Calendar, AlertTriangle, CheckCircle, Clock, AlertCircle, Search, Filter } from 'lucide-react';
import { RegulationItem, ComplianceCriteria } from '@/types';

interface RegulationItemModalProps {
  item: RegulationItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RegulationItemModal({ item, isOpen, onClose }: RegulationItemModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  if (!isOpen || !item) return null;

  // Filter and search criteria based on user input
  const filteredCriteria = useMemo(() => {
    if (!item) return [];
    
    return item.criteria.filter(criteria => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        criteria.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        criteria.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        criteria.requirements.some(req => req.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Category filter
      const matchesCategory = selectedCategory === 'all' || criteria.category === selectedCategory;
      
      // Priority filter
      const matchesPriority = selectedPriority === 'all' || criteria.priority === selectedPriority;
      
      return matchesSearch && matchesCategory && matchesPriority;
    });
  }, [item, searchTerm, selectedCategory, selectedPriority]);

  // Get unique categories and priorities for filter options
  const categories = useMemo(() => {
    if (!item) return [];
    return Array.from(new Set(item.criteria.map(c => c.category))).sort();
  }, [item]);

  const priorities = useMemo(() => {
    if (!item) return [];
    return Array.from(new Set(item.criteria.map(c => c.priority))).sort((a, b) => {
      const order = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
      return order[a as keyof typeof order] - order[b as keyof typeof order];
    });
  }, [item]);

  const getStatusIcon = (status: RegulationItem['status']) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'non-compliant':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'under-review':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
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

  const getPriorityColor = (priority: ComplianceCriteria['priority']) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden bg-white shadow-2xl rounded-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-medium text-blue-100">{item.id}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(item.riskLevel)}`}>
                  {item.riskLevel.toUpperCase()} RISK
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">{item.name}</h2>
              <p className="text-blue-100">{item.category}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-blue-100 hover:text-white hover:bg-blue-600 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6">
            {/* Status and Compliance */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-center gap-3 mb-2">
                  {getStatusIcon(item.status)}
                  <span className="font-medium text-gray-900">Status</span>
                </div>
                <p className="text-lg font-semibold text-gray-700">{getStatusText(item.status)}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Compliance Rate</span>
                  <span className="text-2xl font-bold text-blue-600">{item.complianceRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
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

              <div className="bg-gray-50 p-4 rounded-lg border">
                <span className="font-medium text-gray-900 block mb-2">Criteria Count</span>
                <p className="text-2xl font-bold text-gray-700">{item.criteria.length}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border">{item.description}</p>
            </div>

            {/* Compliance Criteria */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Compliance Criteria</h3>
                <div className="text-sm text-gray-500">
                  {filteredCriteria.length} of {item.criteria.length} criteria
                </div>
              </div>

              {/* Search and Filter Controls */}
              <div className="bg-gray-50 p-4 rounded-lg border mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Search Input */}
                  <div className="md:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search criteria, requirements, or descriptions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  {/* Priority Filter */}
                  <div>
                    <select
                      value={selectedPriority}
                      onChange={(e) => setSelectedPriority(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Priorities</option>
                      {priorities.map(priority => (
                        <option key={priority} value={priority}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Criteria Display */}
              {filteredCriteria.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border">
                  <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-lg font-medium mb-1">No criteria found</p>
                  <p className="text-sm">Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCriteria.map((criteria) => (
                    <div key={criteria.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-gray-900">{criteria.title}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(criteria.priority)}`}>
                                {criteria.priority.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{criteria.id}</p>
                            <p className="text-sm text-blue-600 font-medium">{criteria.category}</p>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-4">{criteria.description}</p>
                        
                        {/* Requirements */}
                        <div className="mb-4">
                          <h5 className="font-medium text-gray-900 mb-2">Requirements:</h5>
                          <ul className="list-disc list-inside space-y-1 bg-gray-50 p-3 rounded-lg">
                            {criteria.requirements.map((requirement, index) => (
                              <li key={index} className="text-sm text-gray-700">{requirement}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Document Links */}
                        {criteria.documentLinks.length > 0 && (
                          <div className="mb-4">
                            <h5 className="font-medium text-gray-900 mb-2">Related Documents:</h5>
                            <div className="flex flex-wrap gap-2">
                              {criteria.documentLinks.map((link, index) => (
                                <a
                                  key={index}
                                  href="#"
                                  className="inline-flex items-center gap-1 px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  {link}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Last Reviewed */}
                        <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
                          <Calendar className="w-3 h-3" />
                          Last reviewed: {new Date(criteria.lastReviewed).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Last updated: {new Date(item.lastUpdated).toLocaleDateString()}
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}