
// Email validation pattern
export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation pattern (US format)
export const phonePattern = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

// Format phone number for display
export function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '');
  
  if (digits.length <= 3) {
    return digits;
  } else if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  } else if (digits.length <= 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }
}

// Clean phone number (remove formatting)
export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '');
}

// Password validation
export function passwordValidator(password: string): string | null {
  if (!password) {
    return 'Password is required';
  }
  
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return 'Password must contain at least one number';
  }
  
  return null;
}

// Email validation
export function validateEmail(email: string): string | null {
  if (!email) {
    return 'Email is required';
  }
  
  if (!emailPattern.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return null;
}

// Phone validation
export function validatePhone(phone: string): string | null {
  if (!phone) {
    return 'Phone number is required';
  }
  
  const cleaned = cleanPhoneNumber(phone);
  if (cleaned.length !== 10) {
    return 'Please enter a valid 10-digit phone number';
  }
  
  return null;
}

// Name validation
export function validateName(name: string): string | null {
  if (!name?.trim()) {
    return 'Name is required';
  }
  
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters long';
  }
  
  return null;
}
