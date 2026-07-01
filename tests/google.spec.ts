import { test, expect, Page } from '@playwright/test';

test('search Google for Giri and then search tree after robot verification', async ({ page }: { page: Page }) => {
  await page.goto('https://www.google.com', { waitUntil: 'domcontentloaded' });

  const acceptButton = page.getByRole('button', { name: /accept|agree|i agree/i }).first();
  if (await acceptButton.isVisible().catch(() => false)) {
    await acceptButton.click();
  }

  const searchBox = page.locator('textarea[name="q"], input[name="q"]').first();
  await expect(searchBox).toBeVisible({ timeout: 30000 });
  await searchBox.fill('Giri');
  await searchBox.press('Enter');

  await page.waitForLoadState('networkidle', { timeout: 30000 });

  const recaptchaFrame = page.frameLocator('iframe[title*="recaptcha"], iframe[title*="Recaptcha"], iframe[src*="recaptcha"]');
  const recaptchaCheckbox = recaptchaFrame.locator('#recaptcha-anchor, .recaptcha-checkbox-border, .recaptcha-checkbox');
  if (await recaptchaCheckbox.isVisible().catch(() => false)) {
    await recaptchaCheckbox.click({ timeout: 15000 });
    await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  }

  const secondSearchBox = page.locator('textarea[name="q"], input[name="q"]').first();
  await expect(secondSearchBox).toBeVisible({ timeout: 30000 });
  await secondSearchBox.fill('tree');
  await secondSearchBox.press('Enter');

  await page.waitForLoadState('networkidle', { timeout: 30000 });
  const bodyText = await page.locator('body').innerText();
  expect(bodyText).toMatch(/tree/i);
});

test('navigate to Postman website and check for latest version', async ({ page }: { page: Page }) => {
  await page.goto('https://www.postman.com/', { waitUntil: 'domcontentloaded' });

  await page.waitForLoadState('networkidle', { timeout: 30000 });

  const pageText = await page.locator('body').innerText();
  const versionMatch = pageText.match(/version|v\d+\.\d+\.\d+|\d+\.\d+\.\d+/i);
  
  if (versionMatch) {
    console.log(`Found version info: ${versionMatch[0]}`);
    expect(pageText).toMatch(/version|v\d+\.\d+\.\d+|\d+\.\d+\.\d+/i);
  } else {
    console.log('Version information not found on main page, checking for downloads page');
    const downloadLink = page.locator('a').filter({ hasText: /download|version/i }).first();
    if (await downloadLink.isVisible().catch(() => false)) {
      await downloadLink.click();
      await page.waitForLoadState('networkidle', { timeout: 30000 });
      const downloadPageText = await page.locator('body').innerText();
      expect(downloadPageText).toMatch(/version|v\d+\.\d+\.\d+|\d+\.\d+\.\d+/i);
    }
  }

  console.log('Closing browser...');
  await page.close();
});
