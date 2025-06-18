
import { useState, useEffect } from 'react';

interface I18nConfig {
  language: string;
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

  const updateLanguage = (language: string) => {
    setConfig(prev => ({ ...prev, language }));
  };

  const updateDirection = (direction: 'ltr' | 'rtl') => {
    setConfig(prev => ({ ...prev, direction }));
  };

  return {
    ...config,
    updateLanguage,
    updateDirection,
    setConfig
  };
}
