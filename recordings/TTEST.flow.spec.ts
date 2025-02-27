const { test, expect } = require('@playwright/test');
test.use({
	ignoreHTTPSErrors: true
});

test('TTEST', async ({ page }) => {
try {
	
	console.log('EXECUTING_FLOW_TEST_ID:3');

	await page.goto('https://localhost:8080/login.gic');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('admin@a.com');
  await page.getByRole('textbox', { name: 'Email' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('GIT123$');
  await page.getByRole('button', { name: 'LOGIN' }).click();
  await expect(page.locator('.layout-content')).toBeVisible();

	console.log('SUCCESSFUL_FLOW_TEST_EXECUTION:3');

} catch (error) {
	console.log('FAILED_FLOW_TEST_EXECUTION:3');
	console.error(error.error?.message || error.message);
	throw error;
}


try {
	
	console.log('EXECUTING_FLOW_TEST_ID:4');

	  await page.getByRole('link', { name: 'Toggle Menu' }).click();
  await page.getByRole('link', { name: '🏢 Projects ' }).click();
  await page.getByRole('link', { name: ' Register' }).click();
  await expect(page.getByText('ProjectsSortGIC Ref Number')).toBeVisible();
  await page.getByRole('row', { name: /Expand Eastern Cape \(\d+\)/ }).getByLabel('Expand').click();
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
  await page.getByRole('option', { name: 'Buffalo City' }).first().waitFor({ state: 'visible' });
  await page.getByRole('option', { name: 'Buffalo City' }).click();
  //wait for 1 second to allow metro to load
  await page.waitForTimeout(1000);
  await page.getByRole('combobox', { name: 'Local Metro/Municipality*' }).click();
  await page.getByRole('option', { name: 'Buffalo City' }).last().waitFor({ state: 'visible' });
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
  

  
  const projectManagerDropdown = page.locator('[id="projectForm:project-detail-tab-view:project-manager"]');
  await projectManagerDropdown.click();
  const listbox = page.locator('[id="projectForm:project-detail-tab-view:project-manager_items"]');
  await listbox.waitFor(); 
  await listbox.locator('li[data-label="Vaughan PM"]').click();


  const contractsManagerDropdown = page.locator('[id="projectForm:project-detail-tab-view:contract-manager"]');
  await contractsManagerDropdown.click();
  const contractsManagerListbox = page.locator('[id="projectForm:project-detail-tab-view:contract-manager_items"]');
  await contractsManagerListbox.waitFor();
  await contractsManagerListbox.locator('li[data-label="VaughanEngineer Eng"]').click();

  const financeManagerDropdown = page.locator('[id="projectForm:project-detail-tab-view:finance-manager"]');
  await financeManagerDropdown.click();
  const financeManagerListbox = page.locator('[id="projectForm:project-detail-tab-view:finance-manager_items"]');
  await financeManagerListbox.waitFor();
  await financeManagerListbox.locator('li[data-label="Vaughan PM"]').click();
    

  const clientPMUDropdown = page.locator('[id="projectForm:project-detail-tab-view:pmu_label"]');
  await clientPMUDropdown.click();
  const clientPMUListbox = page.locator('[id="projectForm:project-detail-tab-view:pmu_items"]');
  await clientPMUListbox.waitFor();
  await clientPMUListbox.locator('li[data-label="VaughanEngineer Eng"]').click();


//  throw new Error('YOU SUCK AT TESTING!!!!');

  await page.getByRole('button', { name: '💾 Submit' }).click();
  await expect(page.getByRole('button', { name: 'AutomatedTesting (Civils)  ' })).toBeVisible();

	console.log('SUCCESSFUL_FLOW_TEST_EXECUTION:4');

} catch (error) {
	console.log('FAILED_FLOW_TEST_EXECUTION:4');
	console.error(error.error?.message || error.message);
	throw error;
}


try {
	
	console.log('EXECUTING_FLOW_TEST_ID:9');

	  // await page.getByRole('row', { name: /Expand Eastern Cape \(\d+\)/ }).getByLabel('Expand').click();
  // await page.getByRole('row', { name: '240502CS Boxwood - Orange' }).getByRole('link').click();
  // await page.getByRole('list').filter({ hasText: 'ActionsView Projects' }).locator('a').click();
  await page.getByLabel('AutomatedTesting (Civils)').getByRole('link', { name: '' }).click();
  await page.getByRole('menuitem', { name: 'Delete Project' }).nth(1).click();
  await page.getByRole('button', { name: 'Yes' }).click();
  await expect(page.getByText('WarningProject Deleted')).toBeVisible();

	console.log('SUCCESSFUL_FLOW_TEST_EXECUTION:9');

} catch (error) {
	console.log('FAILED_FLOW_TEST_EXECUTION:9');
	console.error(error.error?.message || error.message);
	throw error;
}

});
