import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { resolve } from 'path'
import { readFileSync } from 'node:fs'

// Single source of truth for the app version: package.json.
//
// Read with fs rather than `import pkg from './package.json'` (which needs
// resolveJsonModule) or `process.env.npm_package_version` (which is only set
// when the package manager launches the script — it is NOT set inside the
// Docker build, where `bun run generate` runs at a different level). This works
// in every path that builds this app.
const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8')
) as { version?: string }

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  spaLoadingTemplate: false,

  app: {
    head: {
      titleTemplate: '%s | Nibros',
      title: process.env.TITLE || 'NUXT APP',
    }
  },

  css: [
    '~/assets/css/main.css',
    'sweetalert2/dist/sweetalert2.min.css',
    '@sweetalert2/theme-dark'
  ],

  ssr: false,
  sourcemap: false,

  build: {
    transpile: [
      'vuetify',
      '@vuepic/vue-datepicker',
    ]
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },

  runtimeConfig: {
    public: {
      API: process.env.API_URL || 'http://test-erp.test',
      // Dedicated auth microservice (s-erp-auth). Login/refresh/logout are
      // routed here; everything else keeps hitting API above.
      AUTH_URL: process.env.AUTH_URL || 'http://localhost:4020',
      BASE_URL_IMAGE:
        process.env.IMG_BASE_URL || 'http://test-erp.test',
      // Shown on the login page. ssr:false bakes this at BUILD time, so it
      // identifies the deployed artifact rather than the host serving it.
      APP_VERSION: pkg.version || '',
      // Optional CI build identifier. The Jenkinsfile can pass APP_BUILD so a
      // screenshot of the login page names the exact pipeline run.
      APP_BUILD: process.env.APP_BUILD || ''
    }
  },

  modules: [
    'nuxt-icon',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        config.plugins?.push(vuetify({ autoImport: true }))
      })
    },
  ],

  piniaPersistedstate: {
    cookieOptions: {
      sameSite: 'strict',
    },
    storage: 'localStorage'
  },

  imports: {
    dirs: [
      './stores',
      './composables/**'
    ]
  },

  plugins: ['~/plugins/vuesweatalert.ts'],

  vite: {
    vue: {
      template: {
        transformAssetUrls
      }
    }
  },

  devServer: {
    host: '0.0.0.0',
    port: 3002,
  },
})