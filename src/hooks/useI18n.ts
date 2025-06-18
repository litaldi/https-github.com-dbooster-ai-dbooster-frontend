
import { useState, useEffect } from 'react';

export type Language = 'en' | 'he';

interface I18nConfig {
  language: Language;
  direction: 'ltr' | 'rtl';
  dateFormat: string;
  numberFormat: string;
}

const DEFAULT_CONFIG: I18nConfig = {
  language: 'en',
  direction: 'ltr',
  dateFormat: 'MM/dd/yyyy',
  numberFormat: 'en-US'
};

// Simple translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    'toggle_language': 'Toggle language',
  },
  he: {
    'toggle_language': 'החלף שפה',
  }
};

export function useI18n() {
  const [config, setConfig] = useState<I18nConfig>(() => {
    const saved = localStorage.getItem('i18n-config');
    return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : DEFAULT_CONFIG;
  });

  useEffect(() => {
    localStorage.setItem('i18n-config', JSON.stringify(config));
    document.documentElement.lang = config.language;
    document.documentElement.dir = config.direction;
  }, [config]);

  const updateLanguage = (language: Language) => {
    const direction = language === 'he' ? 'rtl' : 'ltr';
    setConfig(prev => ({ ...prev, language, direction }));
  };

  const updateDirection = (direction: 'ltr' | 'rtl') => {
    setConfig(prev => ({ ...prev, direction }));
  };

  const t = (key: string): string => {
    return translations[config.language]?.[key] || key;
  };

  // Alias for backwards compatibility
  const changeLanguage = updateLanguage;

  return {
    ...config,
    updateLanguage,
    changeLanguage,
    updateDirection,
    setConfig,
    t
  };
}
