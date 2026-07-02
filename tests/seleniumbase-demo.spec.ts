import { test, expect, Page } from '@playwright/test';
import { mkdirSync } from 'fs';
import { join } from 'path';

test.use({
  launchOptions: {
    slowMo: 700,
  },
});

test('complete SeleniumBase demo page interactions', async ({ page }: { page: Page }, testInfo) => {
  const screenshotDir = testInfo.outputPath('screenshots');
  mkdirSync(screenshotDir, { recursive: true });

  const captureStep = async (stepNumber: number, stepName: string) => {
    const screenshotName = `${String(stepNumber).padStart(2, '0')}-${stepName}.png`;
    const screenshotPath = join(screenshotDir, screenshotName);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    await testInfo.attach(screenshotName, {
      path: screenshotPath,
      contentType: 'image/png',
    });
    await page.waitForTimeout(700);
  };

  await page.goto('https://seleniumbase.io/demo_page', { waitUntil: 'domcontentloaded' });
  await captureStep(1, 'open-demo-page');

  const textInput = page.locator('#myTextInput');
  await expect(textInput).toBeVisible();
  await textInput.click();
  await captureStep(2, 'click-text-input');
  await textInput.fill('Girinarayanan R');
  await expect(textInput).toHaveValue('Girinarayanan R');
  await captureStep(3, 'enter-name');

  const colorButton = page.locator('#myButton');
  await expect(colorButton).toHaveText('Click Me (Green)');
  await expect(colorButton).toHaveCSS('color', 'rgb(0, 128, 0)');
  await captureStep(4, 'green-button-visible');
  await colorButton.click();
  await expect(colorButton).toHaveText('Click Me (Purple)');
  await expect(colorButton).toHaveCSS('color', 'rgb(128, 0, 128)');
  await captureStep(5, 'button-changed-to-purple');

  const slider = page.locator('#mySlider');
  await slider.fill('80');
  await expect(slider).toHaveValue('80');
  await expect(page.locator('#progressBar')).toHaveJSProperty('value', 80);
  await expect(page.locator('#progressLabel')).toHaveText('Progress Bar: (80%)');
  await captureStep(6, 'slider-and-progress-80');

  const radioButton2 = page.locator('#radioButton2');
  await radioButton2.check();
  await expect(radioButton2).toBeChecked();
  await captureStep(7, 'radio-button-2-selected');

  const iframeCheckbox = page.frameLocator('#myFrame3').locator('#checkBox6');
  await iframeCheckbox.check();
  await expect(iframeCheckbox).toBeChecked();
  await captureStep(8, 'iframe-checkbox-selected');

  const iframeText = page.frameLocator('#myFrame2').locator('h4');
  if (await iframeText.isVisible()) {
    await iframeText.click();
    console.log(`iFrame text exists: ${await iframeText.innerText()}`);
    await captureStep(9, 'iframe-text-clicked');
  }
  await expect(iframeText).toHaveText('iFrame Text');
});
