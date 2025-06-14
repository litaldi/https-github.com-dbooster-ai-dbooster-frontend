
export const AUTH_STORAGE_KEYS = {
  REMEMBER_ME: 'dbooster_remember_me',
  EMAIL: 'dbooster_email',
} as const;

export function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '');
  const match = digits.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return value;
}

export function getStoredAuthData() {
  const rememberMe = localStorage.getItem(AUTH_STORAGE_KEYS.REMEMBER_ME) === 'true';
  const email = localStorage.getItem(AUTH_STORAGE_KEYS.EMAIL) || '';
  
  return { rememberMe, email };
}

export function storeAuthData(email: string, remember: boolean) {
  if (remember) {
    localStorage.setItem(AUTH_STORAGE_KEYS.REMEMBER_ME, 'true');
    localStorage.setItem(AUTH_STORAGE_KEYS.EMAIL, email);
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEYS.REMEMBER_ME);
    localStorage.removeItem(AUTH_STORAGE_KEYS.EMAIL);
  }
}

export function clearAuthData() {
  localStorage.removeItem(AUTH_STORAGE_KEYS.REMEMBER_ME);
  localStorage.removeItem(AUTH_STORAGE_KEYS.EMAIL);
}

export function getAuthRedirectUrl(): string {
  return `${window.location.origin}/`;
}
