import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: true,
    supportedLngs: ["en", "ru", "uz"],
    interpolation: {
      escapeValue: false, // React allaqachon xavfsizligini ta'minlaydi
    },
    backend: {
      loadPath: "/locales/{{lng}}/translation.json", // JSON fayllaringiz yo'li
    },
  });

export default i18n;
