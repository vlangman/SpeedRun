import { test, expect } from '@playwright/test';

test.use({
  ignoreHTTPSErrors: true,
  viewport: {
    height: 1080,
    width: 1920
  }
});

test('test', async ({ page }) => {
  await page.goto('https://localhost:8080/login.gic');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('contractor04+VeeTPlanning2@gittech.co.za');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('GIT@1234');
  await page.getByRole('button', { name: 'LOGIN' }).click();
  await page.getByRole('link', { name: 'Toggle Menu' }).click();
  await page.getByRole('link', { name: ' My Projects ' }).click();
  await page.getByRole('link', { name: ' Contractor Projects' }).click();
  await page.getByRole('row', { name: 'VeeAutomatedTesting' }).getByRole('link').click();
  await page.getByRole('menuitem', { name: 'Redirect to IPW\'s' }).nth(1).click();
  await page.getByRole('button', { name: '+ Request IPW' }).click();
  await page.getByRole('button', { name: 'Select All' }).click();
  await page.getByRole('tab', { name: 'Assigned' }).click();
  await page.getByRole('button', { name: '💾 Submit' }).click();
});