
interface ErrorWithMessage {
  message: string;
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    return new Error(String(maybeError));
  }
}

export function getErrorMessage(error: unknown): string {
  return toErrorWithMessage(error).message;
}

export function sanitizeErrorMessage(message: string): string {
  // Remove potentially sensitive information from error messages
  const sanitizedMessage = message
    .replace(/database|sql|postgres|supabase/gi, 'system')
    .replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[IP]')
    .replace(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi, '[UUID]');

  // Common error message mappings
  const errorMappings: Record<string, string> = {
    'Invalid login credentials': 'Invalid email or password',
    'Email not confirmed': 'Please check your email and confirm your account',
    'User already registered': 'An account with this email already exists',
    'Signup not allowed': 'Account registration is currently unavailable'
  };

  return errorMappings[message] || sanitizedMessage;
}

export class AppError extends Error {
  public readonly code: string;
  public readonly context?: Record<string, any>;

  constructor(message: string, code: string = 'UNKNOWN_ERROR', context?: Record<string, any>) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.context = context;
  }
}

export const handleAuthError = (error: unknown, operation: string) => {
  const message = getErrorMessage(error);
  const sanitizedMessage = sanitizeErrorMessage(message);
  
  console.error(`Auth ${operation} error:`, error);
  
  return new AppError(sanitizedMessage, `AUTH_${operation.toUpperCase()}_ERROR`, {
    originalMessage: message,
    operation
  });
};
