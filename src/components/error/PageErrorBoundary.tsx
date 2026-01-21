'use client';

import ErrorBoundary from './ErrorBoundary';
import { ReactNode } from 'react';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';

interface PageErrorBoundaryProps {
  children: ReactNode;
  pageName?: string;
}

export default function PageErrorBoundary({ children, pageName = 'page' }: PageErrorBoundaryProps) {
  const handleError = (error: Error) => {
    // Log page-specific errors
    console.error(`Error in ${pageName}:`, error);
    
    // In a real application, you might want to send this to an error reporting service
    // Example: errorReportingService.captureException(error, { page: pageName });
  };

  const PageErrorFallback = (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Page Error
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            We're sorry, but there was an error loading this {pageName}.
          </p>
          <p className="text-gray-500">
            This might be a temporary issue. Please try refreshing the page.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            aria-label="Refresh the page"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh Page
          </button>
          
          <button
            onClick={() => window.history.back()}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            aria-label="Go back to previous page"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            If this problem continues, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary fallback={PageErrorFallback} onError={handleError}>
      {children}
    </ErrorBoundary>
  );
}