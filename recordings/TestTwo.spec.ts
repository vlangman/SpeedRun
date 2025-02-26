import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.rfc-editor.org/rfc/rfc2606');
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: '6761' }).click();
  const page1 = await page1Promise;
  await page1.getByRole('link', { name: '2606', exact: true }).click();
  await page1.getByRole('link', { name: '1', exact: true }).first().click();
  await expect(page1.getByText('RFC 2606 Reserved Top Level DNS Names June 1999 2. TLDs for Testing, &')).toBeVisible();
  await page1.getByRole('link', { name: 'RFC 1034' }).click();
  await page1.getByRole('link', { name: 'RFC-1035' }).first().click();
  const page2Promise = page1.waitForEvent('popup');
  await page1.getByRole('link', { name: '7766' }).click();
  const page2 = await page2Promise;
  await page2.locator('pre > a:nth-child(5)').first().click();
});