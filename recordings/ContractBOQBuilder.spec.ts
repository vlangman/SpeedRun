import { test, expect } from '@playwright/test';

test.use({
  ignoreHTTPSErrors: true
});

test('test', async ({ page }) => {
  await page.goto('https://localhost:8080/pages/appointment-process/contract.gic');
  await page.getByRole('button', { name: 'VeeAutomatedTesting (Civils)  ' }).click();
  await page.getByRole('button', { name: 'Actions' }).click();
  await page.getByRole('menuitem', { name: 'Contractor BOQ' }).click();
  await page.getByRole('button', { name: '+ Update BOQ' }).click();
  await page.locator('a').filter({ hasText: 'BOQ Builder' }).click();
  await page.getByRole('button', { name: '+ Add Section Type' }).click();
  await page.locator('[id="addSectionTypeForm\\:section-type"] span').nth(1).click();
  await page.getByRole('option', { name: 'SEWER' }).click();
  await page.getByRole('textbox', { name: 'Number of Sections*' }).click();
  await page.getByRole('textbox', { name: 'Number of Sections*' }).fill('10');
  await page.getByRole('textbox', { name: 'Naming Convention*' }).click();
  await page.getByRole('textbox', { name: 'Naming Convention*' }).fill('ext_1');
  await page.getByRole('combobox', { name: 'Extension*' }).click();
  await page.getByRole('option', { name: 'EXT' }).click();
  await page.getByRole('button', { name: '💾 Submit' }).click();
  await page.locator('li').filter({ hasText: 'Work Items' }).click();
  await page.locator('li').filter({ hasText: 'Section Types' }).click();
  await page.getByRole('gridcell').filter({ hasText: 'Actions' }).click();
  await page.locator('a').filter({ hasText: 'Configure BOL' }).click();
  await page.getByRole('combobox', { name: 'Milestone*' }).click();
  await page.getByRole('option', { name: 'PRELIMINARY AND GENERAL: HEALTH AND SAFETY: Internal And External Audit', exact: true }).click();
  await page.getByRole('textbox', { name: 'Quantity per Work Item*' }).click();
  await page.getByRole('textbox', { name: 'Quantity per Work Item*' }).fill('5');
  await page.locator('#sectionTypeBolForm div').filter({ hasText: 'Add Milestone' }).nth(4).click();
  await page.getByRole('button', { name: '💾 Add Milestone' }).click();
  await page.getByRole('button', { name: '✓ Done' }).click();
  await page.getByRole('link', { name: 'Project Contracts Overview' }).click();
});