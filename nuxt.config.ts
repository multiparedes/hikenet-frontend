import type { NuxtConfig } from "nuxt/schema";

// require dotenv and configure it
require("dotenv").config();
const backendUrl = process.env.BACKEND_BASE_URL || "http://localhost:8000";

export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  modules: [
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "nuxt-icon",
    "@nuxt-alt/auth",
    "@pinia/nuxt",
    "@tresjs/nuxt",
    "@nuxtjs/color-mode",
    "@nuxtjs/i18n",
    "@formkit/auto-animate/nuxt",
  ],
  css: ["~/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  app: {
    head: {
      title: "HikeNet",
    },
  },
  runtimeConfig: {
    public: {
      apiPath: backendUrl,
    },
  },
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
  auth: {
    fullPathRedirect: true,
    resetOnError: true,
    watchLoggedIn: true,
    stores: {
      pinia: {
        enabled: true,
        namespace: "auth",
      },
    },
    redirect: {
      login: "/auth",
      logout: "/",
      callback: "/auth",
      home: "/",
    },
    strategies: {
      cookie: {
        cookie: {
          name: "auth._token.cookie",
        },
        user: {
          property: "user",
          autoFetch: false,
        },
        endpoints: {
          login: { url: `${backendUrl}/auth/login`, method: "post" },
          user: { url: `${backendUrl}/auth/user`, method: "get" },
          logout: false,
        },
      },
    },
  } as NuxtConfig["auth"],
  colorMode: {
    preference: "system",
    fallback: "light",
    hid: "nuxt-color-mode-script",
    globalName: "__NUXT_COLOR_MODE__",
    componentName: "ColorScheme",
    classPrefix: "",
    classSuffix: "",
    storageKey: "nuxt-color-mode",
  },
  i18n: {
    vueI18n: "./i18n.config.ts",
  },
});
