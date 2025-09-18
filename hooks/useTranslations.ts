import { ja } from '../locales/ja';
import { en } from '../locales/en';

const translations = { ja, en };

type Language = 'ja' | 'en';

// Helper to get nested values from an object using a dot-notation string
const get = (obj: any, path: string): string | undefined => 
  path.split('.').reduce((acc, part) => acc && acc[part], obj);

export const useTranslations = (language: Language) => {
  const t = (key: string, params?: Record<string, string | number>): string => {
    let translation = get(translations[language], key);
    
    if (translation === undefined) {
      console.warn(`Translation key "${key}" not found for language "${language}". Falling back to English.`);
      translation = get(translations.en, key);
    }
    
    if (translation === undefined) {
        return key;
    }

    if (params) {
      Object.keys(params).forEach(paramKey => {
        const value = params[paramKey];
        translation = translation!.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(value));
      });
    }

    return translation;
  };

  return { t, lang: translations[language].lang, toggleLang: translations[language].toggleLang };
};
