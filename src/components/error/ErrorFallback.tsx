import { AlertTriangle, RefreshCw, Home, FileX, Wifi, Database } from 'lucide-react';

interface ErrorFallbackProps {
  error?: Error | string;
  onRetry?: () => void;
  type?: 'generic' | 'network' | 'data' | 'notFound' | 'offline';
  title?: string;
  message?: string;
  showRetry?: boolean;
  showHome?: boolean;
  className?: string;
}

const errorConfig = {
  generic: {
    icon: AlertTriangle,
    title: 'Something went wrong',
    message: 'We encountered an unexpected error. Please try again.',
    color: 'text-red-500'
  },
  network: {
    icon: Wifi,
    title: 'Connection Error',
    message: 'Unable to connect to the server. Please check your internet connection.',
    color: 'text-orange-500'
  },
  data: {
    icon: Database,
    title: 'Data Error',
    message: 'There was a problem loading the data. Please try refreshing the page.',
    color: 'text-red-500'
  },
  notFound: {
    icon: FileX,
    title: 'Not Found',
    message: 'The requested resource could not be found.',
    color: 'text-gray-500'
  },
  offline: {
    icon: Wifi,
    title: 'You\'re Offline',
    message: 'Please check your internet connection and try again.',
    color: 'text-gray-500'
  }
};

export default function ErrorFallback({
  error,
  onRetry,
  type = 'generic',
  title,
  message,
  showRetry = true,
  showHome = true,
  className = ''
}: ErrorFallbackProps) {
  const config = errorConfig[type];
  const Icon = config.icon;

  const displayTitle = title || config.title;
  const displayMessage = message || config.message;

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <Icon className={`w-16 h-16 ${config.color} mx-auto mb-4`} />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {displayTitle}
          </h3>
          <p className="text-gray-600 mb-4">
            {displayMessage}
          </p>
          
          {error && typeof error === 'string' && (
            <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded border">
              {error}
            </p>
          )}
        </div>

        <div className="space-y-3">
          {showRetry && onRetry && (
            <button
              onClick={onRetry}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              aria-label="Retry loading content"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          )}
          
          {showHome && (
            <button
              onClick={() => window.location.href = '/'}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              aria-label="Go to home page"
            >
              <Home className="w-4 h-4" />
              Go Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Specific error components for common scenarios
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorFallback
      type="network"
      onRetry={onRetry}
      className="min-h-[300px]"
    />
  );
}

export function DataError({ onRetry, error }: { onRetry?: () => void; error?: string }) {
  return (
    <ErrorFallback
      type="data"
      error={error}
      onRetry={onRetry}
      className="min-h-[300px]"
    />
  );
}

export function NotFoundError({ message }: { message?: string }) {
  return (
    <ErrorFallback
      type="notFound"
      message={message}
      showRetry={false}
      className="min-h-[400px]"
    />
  );
}

export function OfflineError() {
  return (
    <ErrorFallback
      type="offline"
      showRetry={false}
      showHome={false}
      className="min-h-[300px]"
    />
  );
}