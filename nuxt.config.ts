// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-10-24",
  ssr: true,

  sourcemap: {
    client: true,
    server: true,
  },

  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: ["@dcupl/nuxt"],
  dcupl: {
    config: {
      projectId: "PP7ECntN4AI5Zfn5vEou",
      apiKey: "e0aa9e13-8f82-4edb-a5f3-3cf0c9e40207",
    },
  },
});
