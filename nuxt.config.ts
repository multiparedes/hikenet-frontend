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
    "@formkit/nuxt",
    "@nuxt-alt/auth",
    "@pinia/nuxt",
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
  formkit: {
    autoImport: true,
  },
  auth: {
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
  },
});
