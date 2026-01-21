import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

export default function LoadingSpinner({ 
  size = 'md', 
  className = '', 
  text 
}: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center ${className}`} role="status" aria-label="Loading">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
        {text && (
          <span className="text-sm text-gray-600 font-medium">
            {text}
          </span>
        )}
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function InlineSpinner({ size = 'sm', className = '' }: Pick<LoadingSpinnerProps, 'size' | 'className'>) {
  return (
    <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600 ${className}`} aria-hidden="true" />
  );
}