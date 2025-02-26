import { test, expect } from '@playwright/test';

test.use({
  ignoreHTTPSErrors: true
});

test('test', async ({ page }) => {
  await page.goto('https://localhost:8080/pages/admin/dashboard.gic');
  await page.getByRole('link', { name: 'Toggle Menu' }).click();
  await page.getByRole('link', { name: '🏢 Projects ' }).click();
  await page.getByRole('link', { name: ' Register' }).click();
  await expect(page.getByText('ProjectsSortGIC Ref Number')).toBeVisible();
  await page.getByRole('row', { name: 'Expand Eastern Cape (25)' }).getByLabel('Expand').click();
  await page.getByRole('row', { name: '240502CS Boxwood - Orange' }).getByRole('link').click();
  await page.getByRole('list').filter({ hasText: 'ActionsView Projects' }).locator('a').click();
  await page.getByRole('button', { name: '+ Add Project' }).click();
  await expect(page.locator('#addProjectDlg_modal')).toBeVisible();
  await page.getByRole('textbox', { name: 'Project Name*' }).click();
  await page.getByRole('textbox', { name: 'Project Name*' }).fill('VeeAutomatedTesting');
  await page.getByRole('textbox', { name: 'Project Name*' }).press('ControlOrMeta+ArrowLeft');
  await page.getByRole('textbox', { name: 'Project Name*' }).fill('AutomatedTesting');
  await page.getByRole('textbox', { name: 'Project Name*' }).press('End');
  await page.getByRole('textbox', { name: 'Project Name*' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Project Name*' }).press('ControlOrMeta+c');
  await page.getByRole('textbox', { name: 'Project Name*' }).press('Tab');
  await page.getByRole('textbox', { name: 'Short Name*' }).fill('AutomatedTesting');
  await page.getByRole('textbox', { name: 'Short Name*' }).press('Tab');
  await page.getByRole('textbox', { name: 'HSS Number*' }).fill('1582364');
  await page.getByRole('textbox', { name: 'HSS Number*' }).press('Tab');
  await page.getByRole('combobox', { name: 'Project Type*' }).click();
  await page.getByRole('option', { name: 'Civils', exact: true }).click();
  await page.getByRole('textbox', { name: 'Contract Code*' }).click();
  await page.getByRole('textbox', { name: 'Contract Code*' }).fill('154616');
  await page.getByRole('textbox', { name: 'Contract Code*' }).press('Tab');
  await page.getByRole('textbox', { name: 'Number Of Stands*' }).fill('10');
  await page.getByRole('textbox', { name: 'Number Of Stands*' }).press('Tab');
  await page.getByRole('combobox', { name: 'District Municipality*' }).click();
  await page.getByRole('option', { name: 'Buffalo City' }).click();
  await page.getByRole('combobox', { name: 'Local Metro/Municipality*' }).click();
  await page.getByRole('option', { name: 'Buffalo City' }).click();
  await page.getByRole('combobox', { name: 'Address*' }).click();
  await page.getByRole('combobox', { name: 'Address*' }).type('Nels', { delay: 50 })
  await page.waitForSelector('text=Buffalo City, Eastern Cape', { timeout: 8000 });
  await expect(page.getByText('Buffalo City, Eastern CapeBuffalo City, Eastern CapeBuffalo City, Buffalo City')).toBeVisible();
  await page.locator('[id="projectForm\\:project-detail-tab-view\\:locationAutocomplete_item_0"]').click();
  await page.getByRole('textbox', { name: 'City*' }).click();
  await page.getByRole('textbox', { name: 'City*' }).fill('Buffalo');
  await page.getByRole('textbox', { name: 'City*' }).press('Tab');
  await page.getByRole('textbox', { name: 'Postal / Zip Code*' }).fill('1452');
  await page.getByRole('tab', { name: 'Project Administration' }).click();
  await page.getByRole('combobox', { name: 'Project Manager*' }).click();
  await page.getByRole('option', { name: 'Vaughan PM' }).first().click();
  await page.getByRole('combobox', { name: 'Contracts Manager*' }).click();
  await page.getByRole('option', { name: 'VaughanEngineer Eng' }).click();
  await page.getByRole('combobox', { name: 'Finance Manager*' }).click();
  await page.getByRole('option', { name: 'Vaughan PM' }).click();
  await page.getByRole('combobox', { name: 'Client PMU*' }).click();
  await page.getByRole('option', { name: 'Vaughan Langman'}).first().click();
  // await page.getByRole('button', { name: '💾 Submit' }).click();
  // await expect(page.getByRole('button', { name: 'AutomatedTesting (Civils)  ' })).toBeVisible();
});