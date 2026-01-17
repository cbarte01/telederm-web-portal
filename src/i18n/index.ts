import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from './locales/en/common.json';
import enHome from './locales/en/home.json';
import enConditions from './locales/en/conditions.json';
import enBlog from './locales/en/blog.json';

import deCommon from './locales/de/common.json';
import deHome from './locales/de/home.json';
import deConditions from './locales/de/conditions.json';
import deBlog from './locales/de/blog.json';

const resources = {
  en: {
    common: enCommon,
    home: enHome,
    conditions: enConditions,
    blog: enBlog,
  },
  de: {
    common: deCommon,
    home: deHome,
    conditions: deConditions,
    blog: deBlog,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'home', 'conditions', 'blog'],
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
