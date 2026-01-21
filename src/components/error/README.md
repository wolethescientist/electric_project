# Error Handling and Loading States

This directory contains comprehensive error handling and loading state components for the NEMSA Electric Meter Portal.

## Components

### Error Boundaries

#### `ErrorBoundary`
- Catches JavaScript errors in component trees
- Provides retry functionality
- Shows development error details in dev mode
- Supports custom fallback components

#### `PageErrorBoundary`
- Specialized error boundary for full-page errors
- Includes navigation options (refresh, go back)
- Logs page-specific errors

### Error Fallback Components

#### `ErrorFallback`
- Generic error display component
- Supports different error types (network, data, notFound, offline)
- Customizable retry and navigation actions

#### `EmptyState`
- Displays when no data is available
- Supports different contexts (search, filter, data)
- Includes optional action buttons

### Loading Components

#### `LoadingSpinner`
- Animated loading spinner with different sizes
- Optional text labels
- Inline variant available

#### `ProgressBar`
- Determinate and indeterminate progress indicators
- Customizable colors and sizes
- Accessibility compliant

#### `LoadingState`
- Comprehensive loading state manager
- Supports spinner, skeleton, and progress types
- Page-specific variants

#### `SkeletonLoader`
- Animated skeleton placeholders
- Specialized variants for dashboard, metrics, analytics
- Maintains layout structure during loading

### Offline Support

#### `OfflineIndicator`
- Shows connection status
- Animated notifications for offline/online states
- Uses `useOffline` hook

#### Service Worker
- Caches static assets and API responses
- Provides offline functionality
- Background sync support

## Usage Examples

### Basic Error Boundary
```tsx
import { ErrorBoundary } from '@/components/error';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### Page-Level Error Handling
```tsx
import { PageErrorBoundary } from '@/components/error';

<PageErrorBoundary pageName="dashboard">
  <DashboardContent />
</PageErrorBoundary>
```

### Loading States
```tsx
import { LoadingState } from '@/components/ui/loading';

// Skeleton loading
<LoadingState type="skeleton" variant="dashboard" />

// Progress loading
<LoadingState type="progress" progress={75} message="Loading data..." />

// Spinner loading
<LoadingState type="spinner" message="Please wait..." />
```

### Async State Management
```tsx
import useAsyncState from '@/hooks/useAsyncState';

const { data, loading, error, execute } = useAsyncState();

useEffect(() => {
  execute(async () => {
    const response = await fetch('/api/data');
    return response.json();
  });
}, []);
```

### Error Handling Utilities
```tsx
import { logError, withRetry, createAppError } from '@/utils/errorHandling';

// Log errors
try {
  // some operation
} catch (error) {
  logError(error, 'ComponentName');
}

// Retry with exponential backoff
const data = await withRetry(
  () => fetch('/api/data').then(r => r.json()),
  3, // max retries
  1000 // initial delay
);
```

## Accessibility Features

- Screen reader announcements for loading states
- Proper ARIA labels and roles
- Keyboard navigation support
- High contrast mode support
- Reduced motion preferences respected

## Offline Support

The application includes comprehensive offline support:

- Service worker caches static assets
- API responses cached for offline access
- Offline indicator shows connection status
- Graceful degradation when offline

## Error Types

The system recognizes different error types:

- **Network**: Connection or server errors
- **Validation**: Data validation failures
- **Authorization**: Permission errors
- **Data**: Data loading or processing errors
- **Client**: Client-side JavaScript errors
- **Unknown**: Unclassified errors

Each type has appropriate handling and user messaging.