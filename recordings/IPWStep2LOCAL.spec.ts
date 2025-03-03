import { test, expect } from '@playwright/test';

test.use({
  ignoreHTTPSErrors: true,
  viewport: {
    height: 1080,
    width: 1920
  }
});

test('test', async ({ page }) => {
  await page.goto('https://localhost:8080/pages/admin/dashboard.gic');
  await page.getByRole('link', { name: 'Toggle Menu' }).click();
  await page.getByRole('link', { name: ' SIO Tasks' }).click();
  await page.locator('button[name="contentForm\\:tasksList\\:1\\:taskActionBtn"]').click();
  await page.getByRole('combobox', { name: 'Pickup Location*' }).click();
  await page.getByRole('option', { name: 'Head Office' }).click();
  await page.getByRole('combobox', { name: 'Drop Off Location *' }).click();
  await page.getByRole('combobox', { name: 'Drop Off Location *' }).fill('Nelson ');
  await page.getByRole('option', { name: 'Nelson Avenue, East London,' }).click();
  await page.getByRole('combobox', { name: 'Driver*' }).click();
  await page.getByRole('option', { name: 'vaughan Langman' }).click();
  await page.locator('[id="mainForm\\:companyDocumntsTreeRemittance\\:0_1\\:j_idt329"]').click();
  await page.getByText('Select file').click();
  await page.getByLabel('Select file').setInputFiles('CIPC Certificate.pdf');
  await page.locator('[id="mainForm\\:companyDocumntsTreeRemittance\\:0_3\\:j_idt329"]').click();
  await page.getByText('Select file').click();
  await page.getByLabel('Select file').setInputFiles('CIPC Certificate.pdf');
  await page.getByRole('combobox', { name: 'Pickup Location*' }).click();
  await page.getByRole('option', { name: 'Head Office' }).click();
  await page.getByRole('button', { name: 'Approve' }).click();
  await page.getByRole('button', { name: 'Yes' }).click();
  await page.locator('button[name="contentForm\\:tasksList\\:0\\:taskActionBtn"]').click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'Yes' }).click();
  await page.locator('button[name="contentForm\\:tasksList\\:0\\:taskActionBtn"]').click();
  await page.getByRole('button', { name: ' Upload Document' }).click();
  await page.getByLabel('Upload Documents').getByText('Select file').click();
  await page.getByRole('dialog', { name: 'Upload Documents' }).getByLabel('Select file').setInputFiles('CIPC Certificate.pdf');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'Yes' }).click();
});