const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 90_000,
  fullyParallel: false,
  retries: 0,
  use: {
    headless: false,
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chrome',
      use: {
        browserName: 'chromium',
        channel: 'chrome',
      },
    },
    {
      name: 'edge',
      use: {
        browserName: 'chromium',
        channel: 'msedge',
      },
    },
    {
      name: 'firefox',
      use: {
        browserName: 'firefox',
      },
    },
    {
      name: 'webkit',
      use: {
        browserName: 'webkit',
      },
    },
  ],
  reporter: [['list'], ['html', { open: 'always', outputFolder: 'playwright-report' }]],
});
