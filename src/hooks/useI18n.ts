
import { useState, useEffect, useCallback } from 'react';

interface I18nConfig {
  language: string;
  direction: 'ltr' | 'rtl';
  locale: string;
}

const DEFAULT_CONFIG: I18nConfig = {
  language: 'en',
  direction: 'ltr',
  locale: 'en-US'
};

const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

export function useI18n() {
  const [config, setConfig] = useState<I18nConfig>(() => {
    try {
      const stored = localStorage.getItem('i18n-config');
      if (stored) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.warn('Failed to load i18n config:', error);
    }
    return DEFAULT_CONFIG;
  });

  const updateLanguage = useCallback((language: string) => {
    const direction = RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr';
    const locale = `${language}-${language === 'en' ? 'US' : language.toUpperCase()}`;
    
    const newConfig = { language, direction, locale };
    setConfig(newConfig);
    
    try {
      localStorage.setItem('i18n-config', JSON.stringify(newConfig));
    } catch (error) {
      console.warn('Failed to save i18n config:', error);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = config.language;
    document.documentElement.dir = config.direction;
  }, [config]);

  return {
    ...config,
    updateLanguage,
    isRTL: config.direction === 'rtl'
  };
}
