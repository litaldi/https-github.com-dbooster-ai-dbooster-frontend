
export function handleApiError(error: any): string {
  if (!error) return 'An unexpected error occurred';
  
  // Supabase auth errors
  if (error.message) {
    const message = error.message.toLowerCase();
    
    if (message.includes('invalid login credentials')) {
      return 'Invalid email or password. Please check your credentials and try again.';
    }
    
    if (message.includes('email not confirmed')) {
      return 'Please check your email and click the confirmation link before signing in.';
    }
    
    if (message.includes('user already registered')) {
      return 'An account with this email already exists. Try signing in instead.';
    }
    
    if (message.includes('signup is disabled')) {
      return 'New account registration is currently disabled. Please try again later.';
    }
    
    if (message.includes('invalid phone number')) {
      return 'Please enter a valid phone number with country code.';
    }
    
    if (message.includes('too many requests')) {
      return 'Too many attempts. Please wait a few minutes before trying again.';
    }
    
    if (message.includes('network')) {
      return 'Network error. Please check your connection and try again.';
    }
    
    // Return the original message for other known errors
    return error.message;
  }
  
  // Generic fallback
  return 'Something went wrong. Please try again.';
}

export function logError(error: any, context?: string) {
  console.error(context ? `Error in ${context}:` : 'Error:', error);
}
