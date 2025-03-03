import { test, expect } from '@playwright/test';

test.use({
  ignoreHTTPSErrors: true,
  viewport: {
    height: 1080,
    width: 1920
  }
});

test('test', async ({ page }) => {
  await page.goto('https://localhost:8080/pages/admin/dashboard.gic');
  await page.getByRole('link', { name: 'Toggle Menu' }).click();
  await page.getByRole('link', { name: '🏢 Projects ' }).click();
  await page.getByRole('link', { name: ' Register' }).click();
  await page.getByRole('row', { name: 'Expand Eastern Cape (27)' }).getByLabel('Expand').click();
  await page.getByRole('row', { name: '240502CS Boxwood - Orange' }).getByRole('link').click();
  await page.getByRole('list').filter({ hasText: 'ActionsView Projects' }).locator('a').click();
});