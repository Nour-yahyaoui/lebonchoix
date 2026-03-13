// lib/i18n/dictionaries.ts
import { LanguageCode } from './config';

const dictionaries = {
  en: () => import('./dictionaries/en.json').then(module => module.default),
  fr: () => import('./dictionaries/fr.json').then(module => module.default),
  ar: () => import('./dictionaries/ar.json').then(module => module.default),
};

export const getDictionary = async (locale: LanguageCode) => dictionaries[locale]();