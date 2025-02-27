import { test, expect } from '@playwright/test';

test.use({
  ignoreHTTPSErrors: true
});

test('test', async ({ page }) => {
  await page.goto('https://localhost:8080/pages/appointment-process/contract.gic');
  // await page.getByRole('row', { name: /Expand Eastern Cape \(\d+\)/ }).getByLabel('Expand').click();
  // await page.getByRole('row', { name: '240502CS Boxwood - Orange' }).getByRole('link').click();
  // await page.getByRole('list').filter({ hasText: 'ActionsView Projects' }).locator('a').click();
  await page.getByLabel('AutomatedTesting (Civils)').getByRole('link', { name: '' }).click();
  await page.getByRole('menuitem', { name: 'Delete Project' }).nth(1).click();
  await page.getByRole('button', { name: 'Yes' }).click();
  await expect(page.getByText('WarningProject Deleted')).toBeVisible();
});