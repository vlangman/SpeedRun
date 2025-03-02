import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://www.example.com/');
  await page.getByRole('link', { name: 'More information...' }).click({
    button: 'right'
  });
  await page1.getByRole('link', { name: 'RFC 2606' }).click();
  await page1.getByRole('link', { name: 'HTML' }).click();
  await page1.getByRole('link', { name: 'HTML' }).click();
  await page1.getByRole('link', { name: 'PDF' }).click();
});