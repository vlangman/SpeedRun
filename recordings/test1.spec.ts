import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/');
  await page.getByRole('link', { name: 'Checkboxes' }).click();
  await page.getByRole('checkbox').first().check();
  await page.getByText('checkbox 1 checkbox').click();
  await page.getByRole('checkbox').nth(1).uncheck();
  await page.getByRole('checkbox').first().uncheck();
});