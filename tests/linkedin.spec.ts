import { test, expect, Page } from '@playwright/test';

test('linkedin quick sanity check', async ({ page }: { page: Page }) => {
  await page.goto('https://www.linkedin.com', { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('domcontentloaded', { timeout: 30000 });

  const bodyText = await page.locator('body').innerText();
  expect(bodyText).toMatch(/linkedin|sign in|join now/i);

  console.log('LinkedIn page loaded successfully.');
  await page.close();
});
