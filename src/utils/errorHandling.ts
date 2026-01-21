export interface AppError {
  message: string;
  code?: string;
  type: 'network' | 'validation' | 'authorization' | 'server' | 'client' | 'unknown';
  details?: any;
  timestamp: Date;
}

export class NetworkError extends Error {
  public readonly type = 'network';
  public readonly code?: string;
  public readonly timestamp = new Date();

  constructor(message: string, code?: string) {
    super(message);
    this.name = 'NetworkError';
    this.code = code;
  }
}

export class ValidationError extends Error {
  public readonly type = 'validation';
  public readonly code?: string;
  public readonly timestamp = new Date();
  public readonly details?: any;

  constructor(message: string, details?: any, code?: string) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
    this.code = code;
  }
}

export class AuthorizationError extends Error {
  public readonly type = 'authorization';
  public readonly code?: string;
  public readonly timestamp = new Date();

  constructor(message: string, code?: string) {
    super(message);
    this.name = 'AuthorizationError';
    this.code = code;
  }
}

export function createAppError(error: unknown): AppError {
  const timestamp = new Date();

  if (error instanceof NetworkError) {
    return {
      message: error.message,
      code: error.code,
      type: 'network',
      timestamp
    };
  }

  if (error instanceof ValidationError) {
    return {
      message: error.message,
      code: error.code,
      type: 'validation',
      details: error.details,
      timestamp
    };
  }

  if (error instanceof AuthorizationError) {
    return {
      message: error.message,
      code: error.code,
      type: 'authorization',
      timestamp
    };
  }

  if (error instanceof Error) {
    // Try to determine error type from message or other properties
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
      return {
        message: error.message,
        type: 'network',
        timestamp
      };
    }

    if (message.includes('unauthorized') || message.includes('forbidden')) {
      return {
        message: error.message,
        type: 'authorization',
        timestamp
      };
    }

    if (message.includes('validation') || message.includes('invalid')) {
      return {
        message: error.message,
        type: 'validation',
        timestamp
      };
    }

    return {
      message: error.message,
      type: 'client',
      timestamp
    };
  }

  return {
    message: typeof error === 'string' ? error : 'An unexpected error occurred',
    type: 'unknown',
    timestamp
  };
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred';
}

export function getErrorType(error: unknown): AppError['type'] {
  const appError = createAppError(error);
  return appError.type;
}

export function isNetworkError(error: unknown): boolean {
  return getErrorType(error) === 'network';
}

export function isValidationError(error: unknown): boolean {
  return getErrorType(error) === 'validation';
}

export function isAuthorizationError(error: unknown): boolean {
  return getErrorType(error) === 'authorization';
}

// Error logging utility
export function logError(error: unknown, context?: string) {
  const appError = createAppError(error);
  
  const logData = {
    ...appError,
    context,
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
    url: typeof window !== 'undefined' ? window.location.href : 'server'
  };

  if (process.env.NODE_ENV === 'development') {
    console.error('Application Error:', logData);
  }

  // In production, you would send this to your error reporting service
  // Example: errorReportingService.captureException(appError, { context });
}

// Retry utility for network errors
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on validation or authorization errors
      if (isValidationError(error) || isAuthorizationError(error)) {
        throw error;
      }

      if (attempt === maxRetries) {
        break;
      }

      // Exponential backoff
      const waitTime = delay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw lastError;
}