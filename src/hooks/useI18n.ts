
import { useState, useEffect } from 'react';

interface I18nConfig {
  language: string;
  direction: 'ltr' | 'rtl';
}

const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

export function useI18n() {
  const [config, setConfig] = useState<I18nConfig>(() => {
    const savedLanguage = localStorage.getItem('dbooster-language') || 'en';
    return {
      language: savedLanguage,
      direction: RTL_LANGUAGES.includes(savedLanguage) ? 'rtl' : 'ltr'
    };
  });

  const setLanguage = (language: string) => {
    const newConfig = {
      language,
      direction: RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr' as const
    };
    setConfig(newConfig);
    localStorage.setItem('dbooster-language', language);
  };

  useEffect(() => {
    // Apply language direction to document
    document.documentElement.dir = config.direction;
    document.documentElement.lang = config.language;
  }, [config]);

  return {
    ...config,
    setLanguage,
    isRTL: config.direction === 'rtl'
  };
}
