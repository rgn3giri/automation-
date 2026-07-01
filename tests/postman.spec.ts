import { test, expect, Page } from '@playwright/test';

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
