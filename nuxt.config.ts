import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2026-11-10",
  devtools: { enabled: true },

  app: {
    head: {
      title: "dcupl Nuxt Starter",
      htmlAttrs: { lang: "en" },
      link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    },
  },

  css: ["~/assets/css/main.css"],

  vite: {
    plugins: [tailwindcss()],
  },

  modules: ["@dcupl/nuxt"],
  dcupl: {
    config: {
      projectId: "PP7ECntN4AI5Zfn5vEou",
      apiKey: "e0aa9e13-8f82-4edb-a5f3-3cf0c9e40207",
    },
  },
});
