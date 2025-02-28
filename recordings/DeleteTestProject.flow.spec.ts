const { test, expect, Browser, BrowserContext, Page } = require('@playwright/test');
test.use({
	ignoreHTTPSErrors: true
});

test('DeleteTestProject', async ({ page }) => {
try {
	
	console.log('EXECUTING_FLOW_TEST_ID:5');

	await page.goto('https://localhost:8080/login.gic');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('admin@a.com');
  await page.getByRole('textbox', { name: 'Email' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('GIT123$');
  await page.getByRole('button', { name: 'LOGIN' }).click();
  await expect(page.locator('.layout-content')).toBeVisible();

	console.log('SUCCESSFUL_FLOW_TEST_EXECUTION:5');

} catch (error) {
	console.log('FAILED_FLOW_TEST_EXECUTION:5');
	console.error(error.error?.message || error.message);
	throw error;
}


try {
	
	console.log('EXECUTING_FLOW_TEST_ID:6');

	  // await page.getByRole('row', { name: /Expand Eastern Cape \(\d+\)/ }).getByLabel('Expand').click();
  // await page.getByRole('row', { name: '240502CS Boxwood - Orange' }).getByRole('link').click();
  // await page.getByRole('list').filter({ hasText: 'ActionsView Projects' }).locator('a').click();
  await page.getByLabel('AutomatedTesting (Civils)').getByRole('link', { name: '' }).click();
  await page.getByRole('menuitem', { name: 'Delete Project' }).nth(1).click();
  await page.getByRole('button', { name: 'Yes' }).click();
  await expect(page.getByText('WarningProject Deleted')).toBeVisible();

	console.log('SUCCESSFUL_FLOW_TEST_EXECUTION:6');

} catch (error) {
	console.log('FAILED_FLOW_TEST_EXECUTION:6');
	console.error(error.error?.message || error.message);
	throw error;
}

});
