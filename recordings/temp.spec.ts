import { test, expect } from '@playwright/test';

test.use({
  ignoreHTTPSErrors: true,
  viewport: {
    height: 1080,
    width: 1920
  }
});

test('test', async ({ page }) => {
  await page.goto('http://www.example.com/');
  await page.getByRole('link', { name: 'More information...' }).click();
  await expect(page.getByRole('main')).toContainText('RFC 67612');
});