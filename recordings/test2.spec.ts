import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/checkboxes');
  await page.getByRole('checkbox').first().check();
  await page.getByRole('checkbox').nth(1).uncheck();
  await page.goto('https://the-internet.herokuapp.com/checkboxes');
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Elemental Selenium' }).click();
  const page1 = await page1Promise;
  await page1.getByRole('textbox', { name: 'Type in your email address' }).click();
  await page1.getByRole('textbox', { name: 'Type in your email address' }).fill('HelloMoto@gmail.com');
  await page1.getByText('Pick a languageJavaScriptPythonJavaC#RubySend me test automation Pro tips').click();
  await page1.locator('#options').selectOption('python');
});