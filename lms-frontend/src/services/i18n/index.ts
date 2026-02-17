import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ru from './locales/ru.json';
import uz from './locales/uz.json';

const resources = {
  en: en as Record<string, object>,
  ru: ru as Record<string, object>,
  uz: uz as Record<string, object>,
};

export const locales = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'uz', label: "O'zbek" },
];

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: ['common', 'auth', 'navigation', 'footer', 'users', 'products', 'categories', 'orders', 'profile', 'theme', 'errors', 'comments'],
  interpolation: { escapeValue: false },
});

export default i18n;
