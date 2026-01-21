'use client';

import { Mail, Phone, MapPin, User, Building } from 'lucide-react';
import { ContactInfo as ContactInfoType } from '@/types';

interface ContactInfoProps {
  contacts: ContactInfoType[];
}

interface ContactCardProps {
  contact: ContactInfoType;
}

function ContactCard({ contact }: ContactCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
          <User className="w-6 h-6 text-blue-600" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{contact.name}</h3>
          <p className="text-sm text-gray-600 mb-3">{contact.title}</p>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Building className="w-4 h-4 text-gray-400" />
              <span className="font-medium text-gray-700">{contact.department}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-gray-400" />
              <a 
                href={`mailto:${contact.email}`}
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                {contact.email}
              </a>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-gray-400" />
              <a 
                href={`tel:${contact.phone}`}
                className="text-gray-700 hover:text-gray-900"
              >
                {contact.phone}
              </a>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">{contact.office}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactInfo({ contacts }: ContactInfoProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get in touch with NEMSA regulatory departments for assistance with certification, 
          compliance, and technical inquiries related to electrical installations and meters.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contacts.map((contact) => (
          <ContactCard key={`${contact.department}-${contact.name}`} contact={contact} />
        ))}
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
        <h3 className="font-semibold text-blue-900 mb-2">General Information</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>Nigerian Electricity Management Services Agency (NEMSA), Plot 1459, Mohammadu Buhari Way, Central Business District, Abuja, Nigeria</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>Main Office: +234 803 344 5566</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>General Inquiries: info@nemsa.gov.ng</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-blue-200">
          <p className="text-sm text-blue-700">
            <strong>Office Hours:</strong> Monday - Friday, 8:00 AM - 5:00 PM<br />
            <strong>Emergency Contact:</strong> Available 24/7 for critical safety issues
          </p>
        </div>
      </div>
    </div>
  );
}