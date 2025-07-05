
import { useState, useEffect, useCallback } from 'react';

export type Language = 'en' | 'he' | 'es' | 'fr' | 'de';

interface I18nConfig {
  language: Language;
  direction: 'ltr' | 'rtl';
  locale: string;
}

const DEFAULT_CONFIG: I18nConfig = {
  language: 'en',
  direction: 'ltr',
  locale: 'en-US'
};

const RTL_LANGUAGES: Language[] = ['he'];

// Simple translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    toggle_language: 'Toggle language',
    welcome: 'Welcome',
    settings: 'Settings'
  },
  he: {
    toggle_language: 'החלף שפה',
    welcome: 'ברוכים הבאים',
    settings: 'הגדרות'
  },
  es: {
    toggle_language: 'Cambiar idioma',
    welcome: 'Bienvenido',
    settings: 'Configuración'
  },
  fr: {
    toggle_language: 'Changer de langue',
    welcome: 'Bienvenue',
    settings: 'Paramètres'
  },
  de: {
    toggle_language: 'Sprache wechseln',
    welcome: 'Willkommen',
    settings: 'Einstellungen'
  }
};

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

  const updateLanguage = useCallback((language: Language) => {
    const direction: 'ltr' | 'rtl' = RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr';
    const locale = `${language}-${language === 'en' ? 'US' : language.toUpperCase()}`;
    
    const newConfig: I18nConfig = { language, direction, locale };
    setConfig(newConfig);
    
    try {
      localStorage.setItem('i18n-config', JSON.stringify(newConfig));
    } catch (error) {
      console.warn('Failed to save i18n config:', error);
    }
  }, []);

  const t = useCallback((key: string): string => {
    return translations[config.language]?.[key] || key;
  }, [config.language]);

  useEffect(() => {
    document.documentElement.lang = config.language;
    document.documentElement.dir = config.direction;
  }, [config]);

  return {
    ...config,
    updateLanguage,
    isRTL: config.direction === 'rtl',
    t
  };
}
