
import { useState, useEffect } from 'react';

export type Language = 'en';

interface I18nConfig {
  language: Language;
  direction: 'ltr';
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
  const [config, setConfig] = useState<I18nConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
  }, []);

  const t = (key: string): string => {
    return key;
  };

  return {
    ...config,
    t
  };
}
