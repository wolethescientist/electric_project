import Link from 'next/link';
import { BarChart3, FileText, TrendingUp, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import metricsData from '@/data/metrics-data.json';
import regulationItems from '@/data/regulation-items.json';

export default function Home() {
  // Calculate statistics from actual data
  const totalItems = regulationItems.length;
  const compliantItems = regulationItems.filter(item => item.status === 'compliant').length;
  const overallComplianceRate = metricsData.overallComplianceRate;
  const criticalIssues = metricsData.criticalIssues;
  
  const features = [
    {
      icon: BarChart3,
      title: 'Dashboard',
      description: 'Monitor all 16 regulated electric meter categories and their compliance status in Nigeria',
      href: '/dashboard',
    },
    {
      icon: TrendingUp,
      title: 'Metrics',
      description: 'Track performance indicators and compliance rates across all NEMSA regulation items',
      href: '/metrics',
    },
    {
      icon: FileText,
      title: 'Analytics',
      description: 'Access detailed analytics and insights for data-driven regulatory decisions in NESI',
      href: '/analytics',
    },
    {
      icon: Shield,
      title: 'Information',
      description: 'Find NEMSA documentation, FAQs, and regulatory resources for electrical installations',
      href: '/info',
    },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center mb-6">
              <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-blue-200 mb-4 sm:mb-0 sm:mr-4" aria-hidden="true" />
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  NEMSA Electric Meter Portal
                </h1>
                <p className="text-base sm:text-lg text-blue-200 mt-2">
                  Safety, Quality and Efficient Service Delivery
                </p>
              </div>
            </div>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Ensuring the Efficient Production and Delivery of Safe, Reliable and Sustainable Electricity 
              Power Supply and Guarantee Safety of Lives and Property in the Nigerian Electricity Supply 
              Industry through comprehensive regulatory oversight and advanced monitoring systems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="bg-white text-blue-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-900 min-h-[44px]"
                aria-label="Access the regulation dashboard"
              >
                <BarChart3 className="w-5 h-5 mr-2" aria-hidden="true" />
                Access Dashboard
              </Link>
              <Link
                href="/metrics"
                className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-900 min-h-[44px]"
                aria-label="View compliance metrics and reports"
              >
                <TrendingUp className="w-5 h-5 mr-2" aria-hidden="true" />
                View Metrics
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Overview */}
      <section className="py-12 sm:py-16 bg-gray-50" aria-labelledby="stats-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 id="stats-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Regulatory Overview
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Real-time compliance statistics across all regulated electric meter categories
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border-l-4 border-blue-500" role="region" aria-labelledby="total-categories">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1" id="total-categories">{totalItems}</div>
                  <div className="text-gray-600 font-medium text-sm sm:text-base">Regulated Categories</div>
                </div>
                <Shield className="w-8 h-8 sm:w-12 sm:h-12 text-blue-500 opacity-20" aria-hidden="true" />
              </div>
            </div>
            
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border-l-4 border-green-500" role="region" aria-labelledby="compliance-rate">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1" id="compliance-rate">{overallComplianceRate}%</div>
                  <div className="text-gray-600 font-medium text-sm sm:text-base">Overall Compliance Rate</div>
                </div>
                <CheckCircle className="w-8 h-8 sm:w-12 sm:h-12 text-green-500 opacity-20" aria-hidden="true" />
              </div>
            </div>
            
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border-l-4 border-emerald-500" role="region" aria-labelledby="compliant-categories">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-1" id="compliant-categories">{compliantItems}</div>
                  <div className="text-gray-600 font-medium text-sm sm:text-base">Compliant Categories</div>
                </div>
                <CheckCircle className="w-8 h-8 sm:w-12 sm:h-12 text-emerald-500 opacity-20" aria-hidden="true" />
              </div>
            </div>
            
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border-l-4 border-orange-500" role="region" aria-labelledby="attention-items">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1" id="attention-items">{criticalIssues}</div>
                  <div className="text-gray-600 font-medium text-sm sm:text-base">Items Requiring Attention</div>
                </div>
                <AlertTriangle className="w-8 h-8 sm:w-12 sm:h-12 text-orange-500 opacity-20" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-12 sm:py-16 bg-white" aria-labelledby="features-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 id="features-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              NEMSA Regulatory Management Tools
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Access comprehensive tools for monitoring, analyzing, and managing electric meter regulatory 
              compliance across all categories and standards in the Nigerian Electricity Supply Industry
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.title}
                  href={feature.href}
                  className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100 hover:border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label={`Navigate to ${feature.title}: ${feature.description}`}
                >
                  <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl mb-4 sm:mb-6 group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300">
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-900 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    {feature.description}
                  </p>
                  <div className="mt-4 text-blue-600 font-medium group-hover:text-blue-700 transition-colors text-sm sm:text-base">
                    Learn more →
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="bg-gradient-to-r from-gray-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              NEMSA's Mission & Mandate
            </h2>
            <div className="text-lg text-gray-700 leading-relaxed space-y-6">
              <p>
                The Nigerian Electricity Management Services Agency (NEMSA) was established by NEMSA Act 2015 
                (now the Electricity Act 2023) to carry out the Functions of Enforcement of Technical Standards 
                and Regulations, Technical Inspection, Testing and Certification of All Categories of Electrical 
                Installations, Electricity Meters and Instruments.
              </p>
              <p>
                NEMSA's mandate, functions, roles and responsibilities are geared towards constantly improving 
                power supply and safety in Nigeria. We ensure that electrical materials/equipment/instruments 
                used in NESI, workplaces and other premises are of the right type, quality, standard and 
                specifications, and that safety of lives and property within the grid and off-grid networks is assured.
              </p>
            </div>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Safety First</h3>
                <p className="text-gray-600">Ensuring safety of lives and property within the grid and off-grid networks in Nigeria</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Standards</h3>
                <p className="text-gray-600">Maintaining high quality standards for electrical materials and installations in NESI</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Efficient Service Delivery</h3>
                <p className="text-gray-600">Delivering efficient services to constantly improve power supply in Nigeria</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="bg-blue-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Quick Access to NEMSA Functions
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
            Jump directly to the most frequently used NEMSA regulatory management tools
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/dashboard"
              className="bg-white text-blue-900 px-6 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center justify-center"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              View All Categories
            </Link>
            
            <Link
              href="/metrics"
              className="bg-blue-800 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center border border-blue-700"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Compliance Reports
            </Link>
            
            <Link
              href="/analytics"
              className="bg-blue-800 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center border border-blue-700"
            >
              <FileText className="w-5 h-5 mr-2" />
              Trend Analysis
            </Link>
            
            <Link
              href="/info"
              className="bg-blue-800 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center border border-blue-700"
            >
              <Shield className="w-5 h-5 mr-2" />
              Documentation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
