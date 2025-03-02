import { test, expect } from '@playwright/test';

test('test', async ({ page, browser }) => {
  await page.goto('http://www.example.com/');
  await page.getByRole('link', { name: 'More information...' }).click();
  await page.getByRole('link', { name: 'RFC 6761' }).click();
  await page.getByRole('link', { name: '2606', exact: true }).click();
  await expect(page.getByText('Network Working Group D.')).toBeVisible();
});