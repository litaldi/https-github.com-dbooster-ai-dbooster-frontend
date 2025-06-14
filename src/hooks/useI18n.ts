
import { useState, useEffect, useCallback } from 'react';

export type Language = 'en' | 'he' | 'ar' | 'fa' | 'ur';

interface I18nConfig {
  language: string;
  direction: 'ltr' | 'rtl';
}

interface TranslationMap {
  [key: string]: {
    [key: string]: string;
  };
}

const RTL_LANGUAGES: readonly string[] = ['ar', 'he', 'fa', 'ur'];
const STORAGE_KEY = 'dbooster-language';
const DEFAULT_LANGUAGE = 'en';

// Translation system - can be expanded with actual translations
const translations: TranslationMap = {
  en: {
    // English translations
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'auth.signin': 'Sign In',
    'auth.signup': 'Sign Up',
  },
  he: {
    // Hebrew translations
    'common.loading': 'טוען...',
    'common.error': 'שגיאה',
    'auth.signin': 'התחברות',
    'auth.signup': 'הרשמה',
  }
};

export function useI18n() {
  const [config, setConfig] = useState<I18nConfig>(() => {
    const savedLanguage = typeof window !== 'undefined' 
      ? localStorage.getItem(STORAGE_KEY) || DEFAULT_LANGUAGE
      : DEFAULT_LANGUAGE;
    
    return {
      language: savedLanguage,
      direction: RTL_LANGUAGES.includes(savedLanguage) ? 'rtl' : 'ltr'
    };
  });

  const setLanguage = useCallback((language: string) => {
    const newConfig: I18nConfig = {
      language,
      direction: RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr'
    };
    
    setConfig(newConfig);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, language);
    }
  }, []);

  const changeLanguage = useCallback((language: Language) => {
    setLanguage(language);
  }, [setLanguage]);

  const t = useCallback((key: string, fallback?: string): string => {
    const languageTranslations = translations[config.language];
    if (languageTranslations && languageTranslations[key]) {
      return languageTranslations[key];
    }
    
    // Fallback to English if available
    if (config.language !== 'en' && translations.en && translations.en[key]) {
      return translations.en[key];
    }
    
    // Return fallback or key if no translation found
    return fallback || key;
  }, [config.language]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = config.direction;
      document.documentElement.lang = config.language;
    }
  }, [config]);

  return {
    ...config,
    setLanguage,
    changeLanguage,
    t,
    isRTL: config.direction === 'rtl',
    isLTR: config.direction === 'ltr'
  };
}
