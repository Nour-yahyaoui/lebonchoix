// components/ui/language-switcher.tsx
'use client';

import { useLanguage } from '@/contexts/language-context';
import { Globe } from 'lucide-react';
import { useState } from 'react';

export function LanguageSwitcher() {
  const { language, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition"
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium uppercase">{language}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  language === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}