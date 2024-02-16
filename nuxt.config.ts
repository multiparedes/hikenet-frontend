// https://nuxt.com/docs/api/configuration/nuxt-config

const backendUrl = "http://localhost:8000";

export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt"],
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
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
});
