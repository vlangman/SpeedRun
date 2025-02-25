import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://www.example.com/');
  await page.getByRole('link', { name: 'More information...' }).click();
  await page.getByRole('link', { name: 'RFC 2606' }).click();
  await expect(page.getByText('Network Working Group D.')).toBeVisible();
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: '6761' }).click();
  const page1 = await page1Promise;
  await page1.getByRole('link', { name: '2606', exact: true }).click();
  await expect(page1.getByText('Network Working Group D.')).toBeVisible();
  const page2Promise = page1.waitForEvent('popup');
  await page1.getByRole('link', { name: '6761' }).click();
  const page2 = await page2Promise;
});