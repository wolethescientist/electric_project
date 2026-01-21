import Link from 'next/link';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Metrics', href: '/metrics' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'Information', href: '/info' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Accessibility', href: '/accessibility' },
    { name: 'FOIA Requests', href: '/foia' },
  ];

  return (
    <footer className="bg-gray-800 text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Organization Info */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Nigerian Electricity Management Services Agency (NEMSA)</h3>
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              The Nigerian Electricity Management Services Agency (NEMSA) was established by NEMSA Act 2015 
              (now the Electricity Act 2023) to ensure the Efficient Production and Delivery of Safe, Reliable 
              and Sustainable Electricity Power Supply and Guarantee Safety of Lives and Property in the Nigerian 
              Electricity Supply Industry.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="bg-blue-900 px-3 py-1 rounded-full">Est. 2015</span>
              <span className="bg-blue-900 px-3 py-1 rounded-full">16 Regulated Categories</span>
              <span className="bg-blue-900 px-3 py-1 rounded-full">National Authority</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Portal Navigation</h3>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-300 hover:text-white transition-colors flex items-center group focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 rounded-md p-1 min-h-[44px]"
                    aria-label={`Navigate to ${link.name} page`}
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
            
            <h4 className="text-md font-medium mt-6 mb-3">Legal & Compliance</h4>
            <ul className="space-y-2 text-sm">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 rounded-md p-1 min-h-[44px] flex items-center"
                    aria-label={`View ${link.name}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <Mail className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-gray-300">General Inquiries:</p>
                  <a 
                    href="mailto:info@nemsa.gov.ng" 
                    className="text-blue-300 hover:text-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-md p-1"
                    aria-label="Send email to general inquiries"
                  >
                    info@nemsa.gov.ng
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Mail className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-gray-300">Compliance Issues:</p>
                  <a 
                    href="mailto:compliance@nemsa.gov.ng" 
                    className="text-blue-300 hover:text-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-md p-1"
                    aria-label="Send email for compliance issues"
                  >
                    compliance@nemsa.gov.ng
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-gray-300">Main Office:</p>
                  <a 
                    href="tel:+2348033445566" 
                    className="text-blue-300 hover:text-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-md p-1"
                    aria-label="Call main office at +234 803 344 5566"
                  >
                    +234 803 344 5566
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-gray-300">Headquarters:</p>
                  <address className="text-gray-300 not-italic">
                    Plot 1459, Mohammadu Buhari Way<br />
                    Central Business District<br />
                    Abuja, Nigeria
                  </address>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © {currentYear} Nigerian Electricity Management Services Agency (NEMSA). All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                An official website of the Federal Republic of Nigeria
              </p>
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>Last updated: {new Date().toLocaleDateString()}</span>
              <span>•</span>
              <span>Version 2.1.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}