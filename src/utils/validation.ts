
export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phonePattern = /^\(\d{3}\) \d{3}-\d{4}$/;

export const passwordValidator = (value: string): string | null => {
  if (!value || value.length < 8) {
    return 'Password must be at least 8 characters';
  }
  
  const hasUpper = /[A-Z]/.test(value);
  const hasLower = /[a-z]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
  
  if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
    return 'Password must contain uppercase, lowercase, number, and special character';
  }
  
  return null;
};

export const confirmPasswordValidator = (password: string) => (value: string): string | null => {
  if (value !== password) {
    return 'Passwords do not match';
  }
  return null;
};

export const formatPhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  const match = digits.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return value;
};
