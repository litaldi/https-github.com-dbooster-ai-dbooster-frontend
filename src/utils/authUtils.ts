
import { AUTH_CONFIG } from '@/config/auth';

export function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '');
  const match = digits.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return value;
}

export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function getStoredAuthData() {
  const rememberMe = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.REMEMBER_ME) === 'true';
  const email = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.EMAIL) || '';
  
  return { rememberMe, email };
}

export function storeAuthData(email: string, remember: boolean) {
  if (remember) {
    localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.REMEMBER_ME, 'true');
    localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.EMAIL, email);
  } else {
    clearAuthData();
  }
}

export function clearAuthData() {
  Object.values(AUTH_CONFIG.STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}

export function getAuthRedirectUrl(): string {
  return `${window.location.origin}${AUTH_CONFIG.REDIRECT_PATHS.SUCCESS}`;
}

export function createUserMetadata(name: string) {
  return {
    data: { 
      full_name: name.trim(),
      name: name.trim(),
    },
    emailRedirectTo: getAuthRedirectUrl()
  };
}
