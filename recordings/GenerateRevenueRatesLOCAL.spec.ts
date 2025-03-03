import { test, expect } from '@playwright/test';

test.use({
  ignoreHTTPSErrors: true,
  viewport: {
    height: 1080,
    width: 1920
  }
});

test('test', async ({ page }) => {
  await page.goto('https://localhost:8080/pages/appointment-process/contract.gic');
  await page.getByLabel('AutomatedTesting (Civils)').getByRole('link', { name: '' }).click();
  await page.getByRole('menuitem', { name: 'Revenue Rates' }).nth(1).click();
  await page.locator('input[name="mainForm\\:sectionTypeRevenueList\\:0\\:j_idt234_input"]').click();
  await page.locator('input[name="mainForm\\:sectionTypeRevenueList\\:0\\:j_idt234_input"]').fill('R10,000');
  await page.locator('input[name="mainForm\\:sectionTypeRevenueList\\:0\\:j_idt234_input"]').press('Tab');
  await page.locator('input[name="mainForm\\:sectionTypeRevenueList\\:1\\:j_idt234_input"]').click();
  await page.locator('input[name="mainForm\\:sectionTypeRevenueList\\:1\\:j_idt234_input"]').fill('R5,000');
  await page.getByRole('button', { name: '+ Generate Revenue Rates' }).click();
  await page.getByRole('button', { name: 'Yes' }).click();
  await page.getByRole('link', { name: 'Project Overview' }).click();
});