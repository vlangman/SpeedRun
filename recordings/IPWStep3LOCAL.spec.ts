import { test, expect } from '@playwright/test';

test.use({
  ignoreHTTPSErrors: true,
  viewport: {
    height: 1080,
    width: 1920
  }
});

test('test', async ({ page }) => {
  await page.goto('https://localhost:8080/pages/dashboard.gic');
  await page.getByRole('button', { name: '→ Next Steps' }).click();
  await page.locator('[id="completedMilestonesTaskForm\\:companyDocumntsTreeRemittance\\:0_2\\:j_idt348"]').click();
  await page.getByLabel('Upload Documents').getByText('Select file').click();
  await page.getByRole('dialog', { name: 'Upload Documents' }).getByLabel('Select file').setInputFiles('CIPC Certificate.pdf');
  await expect(page.getByText('PLEASE WAIT... This may take')).toBeVisible();
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'Yes' }).click();
});