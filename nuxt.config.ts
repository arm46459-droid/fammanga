// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
  ],

  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.css',
    '~/assets/scss/main.scss',
    '~/assets/css/global.css'
  ],

  build: {
    transpile: ['vuetify'],
  },

  runtimeConfig: {
    // Server-side only
    dbHost: process.env.DB_HOST || 'localhost',
    dbUser: process.env.DB_USER || 'root',
    dbPassword: process.env.DB_PASSWORD || '',
    dbName: process.env.DB_NAME || 'fammanga',
    dbPort: process.env.DB_PORT || '3306',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',

    // Public keys that are exposed to the client
    public: {
      appName: 'FAM Manga',
      appDescription: 'เว็บไซต์อ่านมังงะออนไลน์',
    }
  },

  nitro: {
    preset: 'node-server'
  }
})
