
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password);
};

export const validateForm = (
  formData: {
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    name: string;
  },
  mode: 'login' | 'signup',
  loginType: 'email' | 'phone'
): Record<string, string> => {
  const newErrors: Record<string, string> = {};

  if (loginType === 'email') {
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
  } else {
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
  }

  if (!formData.password) {
    newErrors.password = 'Password is required';
  } else if (mode === 'signup' && !validatePassword(formData.password)) {
    newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
  }

  if (mode === 'signup') {
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
  }

  return newErrors;
};
