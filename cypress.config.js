import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:5173',
    video: false,
    setupNodeEvents(/* on, config */) {
      // implement node event listeners here
    },
  },
});