// require dotenv and configure it
require("dotenv").config();
const backendUrl = process.env.BACKEND_BASE_URL || "http://localhost:8000";

export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt", "nuxt-icon", "@formkit/nuxt"],
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
});
