import { test, expect } from '@playwright/test';

test.use({
  ignoreHTTPSErrors: true
});

test('test', async ({ page }) => {
  await page.goto('https://localhost:8080/pages/appointment-process/contract.gic');
  await page.getByRole('button', { name: 'VeeAutomatedTesting (Civils)  ' }).click();
  await page.getByRole('button', { name: 'Actions' }).click();
  await page.getByRole('menuitem', { name: 'Packages' }).click();
  await page.getByRole('button', { name: '+ Add Package' }).click();
  await page.getByRole('textbox', { name: 'Package Name*' }).fill('AUTO_TEST_PACKAGE_1');
  await page.getByRole('button', { name: 'Select All' }).click();
  await page.getByTitle('10').click();
  await page.getByRole('button', { name: '💾 Submit' }).click();
  await page.getByRole('button', { name: ' Generate Contracts' }).click();
  await page.getByRole('button', { name: 'Yes' }).click();
  await page.getByRole('button', { name: 'VeeAutomatedTesting (Civils)  ' }).click();
  await page.locator('button[name="mainForm\\:mainTV\\:j_idt232\\:0\\:j_idt239\\:0\\:contractActions"]').click();
  await page.getByRole('menuitem', { name: 'Assign Contractor' }).click();
  await page.locator('[id="assignSPContractForm\\:sp-contractor-tabview\\:sub-contractor"] span').nth(1).click();
  await page.getByRole('textbox', { name: 'Filter' }).fill('vee');
  await page.getByRole('option', { name: 'VEE COMPANY PLANNING' }).click();
  await page.getByRole('tab', { name: 'Services' }).click();
  await page.locator('[id="assignSPContractForm\\:sp-contractor-tabview\\:dataTableListPackage\\:0\\:j_idt1162_input"]').click();
  await page.locator('[id="assignSPContractForm\\:sp-contractor-tabview\\:dataTableListPackage\\:0\\:j_idt1162_input"]').fill('R10,000');
  await page.locator('[id="assignSPContractForm\\:sp-contractor-tabview\\:dataTableListPackage\\:0\\:j_idt1162_input"]').press('Tab');
  await page.getByRole('tab', { name: 'Key Personnel' }).click();
  await page.getByRole('button', { name: '+ Add Key Personnel' }).click();
  await page.getByRole('combobox', { name: 'Key Personnel*' }).click();
  await page.getByRole('option', { name: 'VeeTPlanner Owner' }).click();
  await page.getByRole('button', { name: '💾 Submit' }).click();
  await page.getByRole('button', { name: '✓ Assign Contract' }).click();
  await page.getByRole('button', { name: 'Yes' }).click();
  await page.getByRole('tab', { name: 'Contract Retention Schedule' }).click();
  await page.getByRole('tab', { name: 'Contract Details' }).click();
  await page.getByRole('tab', { name: 'Services' }).click();
  await page.getByRole('tab', { name: 'Material' }).click();
  await page.getByRole('tab', { name: 'Programme Summary' }).click();
  await page.locator('[id="assignSPContractForm\\:sp-contractor-tabview\\:dataTableListProg\\:0\\:j_idt1224_input"]').click();
  await page.locator('[id="assignSPContractForm\\:sp-contractor-tabview\\:dataTableListProg\\:0\\:j_idt1224_input"]').fill('1');
  await page.locator('[id="assignSPContractForm\\:sp-contractor-tabview\\:dataTableListProg\\:0\\:j_idt1226"]').click();
  await page.locator('[id="assignSPContractForm\\:sp-contractor-tabview\\:dataTableListProg\\:0\\:j_idt1226_input"]').click();
  await page.locator('[id="assignSPContractForm\\:sp-contractor-tabview\\:dataTableListProg\\:0\\:j_idt1226_input"]').fill('2');
  await page.getByRole('button', { name: '✓ Assign Contract' }).click();
  await page.getByRole('button', { name: 'Yes' }).click();
});