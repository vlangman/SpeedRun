import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.rfc-editor.org/rfc/rfc6761.html');
  await page.getByRole('link', { name: 'Section 2 of RFC' }).click();
  await page.getByRole('link', { name: 'RFC5742' }).click();
  await expect(page.getByText('Internet Engineering Task')).toBeVisible();
});