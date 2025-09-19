import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    video: false,
    defaultCommandTimeout: 30000,
    requestTimeout: 30000,
    responseTimeout: 30000,
    pageLoadTimeout: 60000,
    retries: {
      runMode: 3,
      openMode: 0
    },
    experimentalStudio: true,
    chromeWebSecurity: false,
    setupNodeEvents() {
      // Fungsi ini diperlukan tapi tidak menggunakan parameter
    },
  },
});