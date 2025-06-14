
import { useState, useEffect } from 'react';

export type Language = 'en' | 'he' | 'ar' | 'fa' | 'ur';

interface I18nConfig {
  language: string;
  direction: 'ltr' | 'rtl';
}

const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

// Simple translation function - can be expanded later
const translations = {
  en: {
    // English translations can be added here
  },
  he: {
    // Hebrew translations can be added here
  }
};

export function useI18n() {
  const [config, setConfig] = useState<I18nConfig>(() => {
    const savedLanguage = localStorage.getItem('dbooster-language') || 'en';
    return {
      language: savedLanguage,
      direction: RTL_LANGUAGES.includes(savedLanguage) ? 'rtl' : 'ltr'
    };
  });

  const setLanguage = (language: string) => {
    const newConfig: I18nConfig = {
      language,
      direction: RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr'
    };
    setConfig(newConfig);
    localStorage.setItem('dbooster-language', language);
  };

  const changeLanguage = (language: Language) => {
    setLanguage(language);
  };

  const t = (key: string) => {
    // Simple translation function - returns key if translation not found
    return key;
  };

  useEffect(() => {
    // Apply language direction to document
    document.documentElement.dir = config.direction;
    document.documentElement.lang = config.language;
  }, [config]);

  return {
    ...config,
    setLanguage,
    changeLanguage,
    t,
    isRTL: config.direction === 'rtl'
  };
}
