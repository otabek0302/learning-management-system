import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Importing the translations
import en from "@/locales/en.json";
import ru from "@/locales/ru.json";
import uz from "@/locales/uz.json";

// Initialize only once
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      uz: { translation: uz },
    },
    lng: "uz",
    fallbackLng: "uz",
    interpolation: { escapeValue: false },
  });
}

// Get translations
export const getTranslation = (key: string) => {
  return i18n.t(key);
};

// Set language
export const setTranslation = (language: string) => {
  i18n.changeLanguage(language);
  localStorage.setItem("i18nextLng", language);
};

export default i18n;
