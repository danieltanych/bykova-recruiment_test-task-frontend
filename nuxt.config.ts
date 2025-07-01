import { defineNuxtConfig } from "nuxt/config";
import en from "./locales/en-US.json";
import fr from "./locales/fr-FR.json";
import ar from "./locales/ar-AR.json";

export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      baseUrl: process.env.VITE_BASE_URL,
    },
  },

  nitro: {
    compressPublicAssets: true,
    logLevel: 4,
  },

  modules: [
    "@nuxt/eslint",
    "@pinia/nuxt",
    "@nuxtjs/device",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/google-fonts",
    "@nuxtjs/color-mode",
    "@nuxtjs/i18n",
    "@dargmuesli/nuxt-cookie-control",
  ],

  tailwindcss: {
    cssPath: "~/assets/css/tailwind.css",
    configPath: "tailwind.config.ts",
    exposeConfig: false,
    viewer: true,
  },

  postcss: {
    plugins: {
      "postcss-import": {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  imports: {
    dirs: ["./stores", "./locales"],
  },

  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
    },
  },

  colorMode: {
    preference: "light",
    fallback: "light",
    classSuffix: "",
    storage: "localStorage",
    storageKey: "nuxt-color-mode",
  },

  image: {
    provider: "ipx",
    quality: 80,
    format: ["png", "jpeg", "webp"],
  },

  googleFonts: {
    families: {
      Inter: true,
    },
    display: "swap",
    prefetch: true,
    preconnect: true,
  },

  i18n: {
    baseUrl: process.env.VITE_BASE_URL,
    vueI18n: "i18n.config.ts",
    detectBrowserLanguage: {
      useCookie: false,
      alwaysRedirect: true,
      fallbackLocale: "en-US",
      redirectOn: "root",
    },
  },

  cookieControl: {
    cookieExpiryOffsetMs: 1000 * 60 * 60 * 24 * 365,
    isAcceptNecessaryButtonEnabled: true,
    isModalForced: false,
    isCookieIdVisible: true,
    closeModalOnClickOutside: true,
    isControlButtonEnabled: true,
    isCssEnabled: false,
    isDashInDescriptionEnabled: false,
    cookies: {
      necessary: [
        {
          name: {
            fr: fr.cookies.necessary.title,
            en: en.cookies.necessary.title,
            ar: ar.cookies.necessary.title,
          },
          description: {
            fr: fr.cookies.necessary.description,
            en: en.cookies.necessary.description,
            ar: ar.cookies.necessary.description,
          },
          isPreselected: true,
          id: "necessary",
        },
      ],
      optional: [],
    },
    locales: ["en", "fr", "ar"],
  },

  compatibilityDate: "2024-12-26",
});
