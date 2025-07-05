
import { useState, useEffect } from 'react';

interface I18nConfig {
  locale: string;
  direction: 'ltr' | 'rtl';
  dateFormat: string;
  currency: string;
}

const defaultConfig: I18nConfig = {
  locale: 'en-US',
  direction: 'ltr',
  dateFormat: 'MM/dd/yyyy',
  currency: 'USD'
};

const rtlLanguages = ['ar', 'he', 'fa', 'ur'];

export function useI18n() {
  const [config, setConfig] = useState<I18nConfig>(() => {
    const savedLocale = localStorage.getItem('dbooster-locale');
    const browserLocale = navigator.language || 'en-US';
    const locale = savedLocale || browserLocale;
    
    return {
      ...defaultConfig,
      locale,
      direction: rtlLanguages.some(lang => locale.startsWith(lang)) ? 'rtl' : 'ltr'
    };
  });

  useEffect(() => {
    localStorage.setItem('dbooster-locale', config.locale);
    document.documentElement.lang = config.locale;
    document.documentElement.dir = config.direction;
  }, [config]);

  const setLocale = (locale: string) => {
    setConfig(prev => ({
      ...prev,
      locale,
      direction: rtlLanguages.some(lang => locale.startsWith(lang)) ? 'rtl' : 'ltr'
    }));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(config.locale).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.currency
    }).format(amount);
  };

  return {
    ...config,
    setLocale,
    formatDate,
    formatCurrency
  };
}
