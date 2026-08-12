/**
 * Structured logger for production environments.
 * Formats logs as JSON strings which are easily parsed by services like Datadog, ELK, or CloudWatch.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

function formatMessage(level: LogLevel, message: string, meta?: any) {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  });
}

export const logger = {
  info: (message: string, meta?: any) => {
    console.log(formatMessage('info', message, meta));
  },
  warn: (message: string, meta?: any) => {
    console.warn(formatMessage('warn', message, meta));
  },
  error: (message: string, error?: any, meta?: any) => {
    // Standardize error object parsing without leaking full stack traces in production (unless debug mode)
    let errorDetails: any;
    try {
      errorDetails = error instanceof Error ? {
          name: error.name,
          message: error.message,
          // Only include stack in non-production environments
          ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
      } : (typeof error === 'string' ? { message: error } : { message: String(error) });
    } catch {
      errorDetails = { message: 'Error object could not be serialized' };
    }

    try {
      console.error(formatMessage('error', message, { error: errorDetails, ...meta }));
    } catch {
      // Fallback if JSON.stringify fails due to circular references
      console.error(`[ERROR] ${message}:`, errorDetails?.message || 'Unknown error');
    }
  },
  debug: (message: string, meta?: any) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(formatMessage('debug', message, meta));
    }
  }
};
