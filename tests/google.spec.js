const { test, expect } = require('@playwright/test');

test('search Google for Giri and then search tree after robot verification', async ({ page }) => {
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
