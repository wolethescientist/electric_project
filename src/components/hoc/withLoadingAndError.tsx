'use client';

import React, { ComponentType } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorFallback from '@/components/error/ErrorFallback';

interface WithLoadingAndErrorProps {
  loading?: boolean;
  error?: string | Error | null;
  onRetry?: () => void;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
}

export default function withLoadingAndError<P extends object>(
  WrappedComponent: ComponentType<P>
) {
  const WithLoadingAndErrorComponent = (props: P & WithLoadingAndErrorProps) => {
    const {
      loading = false,
      error = null,
      onRetry,
      loadingComponent,
      errorComponent,
      ...componentProps
    } = props;

    if (loading) {
      return (
        <div className="min-h-[200px] flex items-center justify-center">
          {loadingComponent || <LoadingSpinner size="lg" text="Loading..." />}
        </div>
      );
    }

    if (error) {
      const errorMessage = error instanceof Error ? error.message : error;
      return (
        <div className="min-h-[200px]">
          {errorComponent || (
            <ErrorFallback
              error={errorMessage}
              onRetry={onRetry}
              type="generic"
            />
          )}
        </div>
      );
    }

    return <WrappedComponent {...(componentProps as P)} />;
  };

  WithLoadingAndErrorComponent.displayName = `withLoadingAndError(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithLoadingAndErrorComponent;
}