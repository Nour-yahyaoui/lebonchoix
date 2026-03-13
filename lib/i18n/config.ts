// lib/i18n/config.ts
export const languages = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'fr', name: 'Français', dir: 'ltr' },
  { code: 'ar', name: 'العربية', dir: 'rtl' }
] as const;

export type LanguageCode = typeof languages[number]['code'];
export const defaultLanguage: LanguageCode = 'fr';