const { test, expect } = require('@playwright/test');
test.use({
	ignoreHTTPSErrors: true
});

test('TestFlow1', async ({ page , browser }) => {
try {
	
	console.log('EXECUTING_FLOW_TEST_ID:1');

	await page.goto('http://www.example.com/');
  await page.getByRole('link', { name: 'More information...' }).click();
  await page.getByRole('link', { name: 'RFC 6761' }).click();
  await page.getByRole('link', { name: '2606', exact: true }).click();
  await expect(page.getByText('Network Working Group D.')).toBeVisible();


	console.log('SUCCESSFUL_FLOW_TEST_EXECUTION:1');

} catch (error) {
	console.log('FAILED_FLOW_TEST_EXECUTION:1');
	console.error(error.error?.message || error.message);
	throw error;
}

try {
	
	console.log('EXECUTING_FLOW_TEST_ID:2');

	await page.waitForURL('https://www.rfc-editor.org/rfc/rfc2606');  const page1Promise = page.waitForEvent('popup');
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
  //throw new Error('WOW YOU REALLY SUCK AT TESTING!!!');
  await page2.locator('pre > a:nth-child(5)').first().click();


	console.log('SUCCESSFUL_FLOW_TEST_EXECUTION:2');

} catch (error) {
	console.log('FAILED_FLOW_TEST_EXECUTION:2');
	console.error(error.error?.message || error.message);
	throw error;
}
});
