
import { emailPattern, phonePattern, passwordValidator, formatPhoneNumber } from './validation';

interface FormData {
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  name: string;
}

export function validateForm(
  formData: FormData, 
  mode: 'login' | 'register', 
  loginType: 'email' | 'phone'
): Record<string, string> {
  const errors: Record<string, string> = {};

  // Name validation for signup
  if (mode === 'register') {
    if (!formData.name?.trim()) {
      errors.name = 'Full name is required';
    } else if (formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
  }

  // Email/Phone validation
  if (loginType === 'email') {
    if (!formData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!emailPattern.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
  } else {
    if (!formData.phone?.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!phonePattern.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
  }

  // Password validation
  if (!formData.password?.trim()) {
    errors.password = 'Password is required';
  } else if (mode === 'register') {
    const passwordError = passwordValidator(formData.password);
    if (passwordError) {
      errors.password = passwordError;
    }
  }

  // Confirm password validation for signup
  if (mode === 'register' && formData.password) {
    if (!formData.confirmPassword?.trim()) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
  }

  return errors;
}

// Re-export utilities for backward compatibility
export { formatPhoneNumber };
