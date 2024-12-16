import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import languageDetector from "i18next-browser-languagedetector";
import uzTranslation from "../public/locales/uz.json";
import afgTranslation from "../public/locales/afg.json";

i18n
  .use(Backend)
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "afg",  // Default language if one is not found
    lng: "uz",  // Default language set to 'uz'
    debug: true,
    resources: {
      uz: { translation: uzTranslation },  // Uzbek translations
      afg: { translation: afgTranslation },  // Farsi translations
    },
  });

export default i18n;
