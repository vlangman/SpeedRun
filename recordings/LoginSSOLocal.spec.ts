import { test, expect } from '@playwright/test';

test.use({
  ignoreHTTPSErrors: true,
  viewport: {
    height: 1080,
    width: 1920
  }
});

test('test', async ({ page }) => {
  await page.goto('https://localhost:8080/login.gic');
  await page.locator('div').filter({ hasText: 'LOGIN Don\'t have an account?' }).first().click();
  await page.getByRole('link', { name: 'LOGIN WITH ACCOUNT' }).click();
  await page.getByRole('textbox', { name: 'someone@gic.co.za' }).click();
  await page.getByRole('textbox', { name: 'someone@gic.co.za' }).fill('contractor4@gittech.co.za');
  await page.getByRole('textbox', { name: 'someone@gic.co.za' }).press('Tab');
  await page.getByRole('link', { name: 'Can’t access your account?' }).press('Tab');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('textbox', { name: 'Enter the password for' }).click();
  await page.getByRole('textbox', { name: 'Enter the password for' }).fill('G1c!@2024GITcon4');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('heading', { name: 'Approve sign in request' })).toBeVisible();
  await page.waitForURL('https://login.microsoftonline.com/common/SAS/ProcessAuth');
  await expect(page.getByRole('heading', { name: 'Stay signed in?' })).toBeVisible();
  await page.getByRole('button', { name: 'No' }).click();
});