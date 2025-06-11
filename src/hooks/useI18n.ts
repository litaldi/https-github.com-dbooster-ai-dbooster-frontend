
import { useState, useEffect } from 'react';

export type Language = 'en' | 'he';
export type Direction = 'ltr' | 'rtl';

interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

const translations: Translations = {
  // Authentication
  'auth.signIn': {
    en: 'Sign In',
    he: 'התחברות'
  },
  'auth.signUp': {
    en: 'Sign Up',
    he: 'הרשמה'
  },
  'auth.email': {
    en: 'Email',
    he: 'אימייל'
  },
  'auth.password': {
    en: 'Password',
    he: 'סיסמה'
  },
  'auth.forgotPassword': {
    en: 'Forgot password?',
    he: 'שכחת סיסמה?'
  },
  'auth.rememberMe': {
    en: 'Remember me',
    he: 'זכור אותי'
  },
  'auth.createAccount': {
    en: 'Create Account',
    he: 'צור חשבון'
  },
  'auth.alreadyHaveAccount': {
    en: 'Already have an account?',
    he: 'כבר יש לך חשבון?'
  },
  'auth.dontHaveAccount': {
    en: "Don't have an account?",
    he: 'אין לך חשבון?'
  },
  // Navigation
  'nav.dashboard': {
    en: 'Dashboard',
    he: 'לוח בקרה'
  },
  'nav.repositories': {
    en: 'Repositories',
    he: 'מאגרים'
  },
  'nav.queries': {
    en: 'Queries',
    he: 'שאילתות'
  },
  'nav.settings': {
    en: 'Settings',
    he: 'הגדרות'
  },
  // Common
  'common.loading': {
    en: 'Loading...',
    he: 'טוען...'
  },
  'common.error': {
    en: 'Error',
    he: 'שגיאה'
  },
  'common.success': {
    en: 'Success',
    he: 'הצלחה'
  },
  'common.cancel': {
    en: 'Cancel',
    he: 'ביטול'
  },
  'common.save': {
    en: 'Save',
    he: 'שמור'
  },
  'common.close': {
    en: 'Close',
    he: 'סגור'
  }
};

export function useI18n() {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('dbooster-language');
    return (stored as Language) || 'en';
  });

  const direction: Direction = language === 'he' ? 'rtl' : 'ltr';

  useEffect(() => {
    localStorage.setItem('dbooster-language', language);
    document.dir = direction;
    document.documentElement.lang = language;
  }, [language, direction]);

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return {
    language,
    direction,
    t,
    changeLanguage
  };
}
