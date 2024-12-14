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
    fallbackLng: "afg",
    lng:"uz",
    debug: true,
    resources: {
        uz: { translation: uzTranslation },
        afg: { translation: afgTranslation }
    },
})
export default i18n;