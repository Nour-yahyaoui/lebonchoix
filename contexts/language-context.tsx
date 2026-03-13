// contexts/language-context.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { languages, defaultLanguage, LanguageCode } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, params?: Record<string, string>) => string;
  dir: 'ltr' | 'rtl';
  languages: typeof languages;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<LanguageCode>(defaultLanguage);
  const [dictionary, setDictionary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved language from localStorage
    const saved = localStorage.getItem('language') as LanguageCode;
    if (saved && languages.some(l => l.code === saved)) {
      setLanguage(saved);
    }
  }, []);

  useEffect(() => {
    // Load dictionary when language changes
    setIsLoading(true);
    getDictionary(language).then(dict => {
      setDictionary(dict);
      setIsLoading(false);
      // Set HTML dir attribute
      document.documentElement.dir = languages.find(l => l.code === language)?.dir || 'ltr';
      // Save to localStorage
      localStorage.setItem('language', language);
    });
  }, [language]);

  const t = (key: string, params?: Record<string, string>) => {
    if (!dictionary) return key;
    
    const keys = key.split('.');
    let value = dictionary;
    
    for (const k of keys) {
      if (!value[k]) return key;
      value = value[k];
    }
    
    if (typeof value !== 'string') return key;
    
    if (params) {
      return Object.entries(params).reduce(
        (str, [key, val]) => str.replace(`{{${key}}}`, val),
        value
      );
    }
    
    return value;
  };

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t,
      dir: languages.find(l => l.code === language)?.dir || 'ltr',
      languages
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}