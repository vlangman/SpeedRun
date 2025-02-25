import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://www.example.com/');
  await page.getByRole('link', { name: 'More information...' }).click();
  await page.getByRole('link', { name: 'RFC 6761' }).click();
  await expect(page.getByText('Internet Engineering Task')).toBeVisible();
});