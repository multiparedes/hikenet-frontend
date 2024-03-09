import en from "./langs/en.json";
import es from "./langs/es.json";
import ca from "./langs/ca.json";

export default defineI18nConfig(() => ({
  legacy: false,
  locale: "en",
  fallbackLocale: "es",
  globalInjection: true,
  messages: {
    en,
    es,
    ca,
  },
  detectBrowserLanguage: {
    useCookie: true,
    cookieKey: "i18n_redirected",
    redirectOn: "root",
  },
}));
