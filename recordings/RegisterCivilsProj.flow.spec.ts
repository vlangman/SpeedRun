const { test, expect,defineConfig } = require('@playwright/test');
test.use({
	ignoreHTTPSErrors: true
});

export default defineConfig({
  timeout: 60000,  // Set global timeout to 60 seconds for all tests
});

test('Register Civils Proj', async ({ page , browser }) => {
try {
	
	console.log('EXECUTING_FLOW_TEST_ID:5:15');

	await page.goto('https://localhost:8080/login.gic');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('Admin@a.com');
  await page.getByRole('textbox', { name: 'Email' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('GIT123$');
  await page.getByRole('button', { name: 'LOGIN' }).click();
  await page.getByRole('link', { name: 'Toggle Menu' }).click();


	console.log('SUCCESSFUL_FLOW_TEST_EXECUTION:5:15');

} catch (error) {
	console.log('FAILED_FLOW_TEST_EXECUTION:5:15');
	console.error(error.error?.message || error.message);
	throw error;
}

try {
	
	console.log('EXECUTING_FLOW_TEST_ID:5:16');

	await page.waitForURL('https://localhost:8080/pages/admin/dashboard.gic');  await page.getByRole('link', { name: 'Toggle Menu' }).click();
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
  await page.getByRole('textbox', { name: 'Project Name*' }).press('Tab');
  await page.getByRole('textbox', { name: 'Short Name*' }).fill('VeeAutomatedTesting');
  await page.getByRole('textbox', { name: 'Short Name*' }).press('Tab');
  await page.getByRole('textbox', { name: 'HSS Number*' }).fill('5581851');
  await page.getByRole('textbox', { name: 'HSS Number*' }).press('Tab');

  await page.getByRole('combobox', { name: 'Project Type*' }).click();
  await page.getByRole('option', { name: 'Civils', exact: true }).click();
  await page.getByRole('textbox', { name: 'Contract Code*' }).click();
  await page.getByRole('textbox', { name: 'Contract Code*' }).fill('2584896');
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
  await expect(page.getByRole('button', { name: 'VeeAutomatedTesting (Civils)  ' })).toBeVisible();


	console.log('SUCCESSFUL_FLOW_TEST_EXECUTION:5:16');

} catch (error) {
	console.log('FAILED_FLOW_TEST_EXECUTION:5:16');
	console.error(error.error?.message || error.message);
	throw error;
}

try {
	
	console.log('EXECUTING_FLOW_TEST_ID:5:28');

	await page.waitForURL('https://localhost:8080/pages/appointment-process/contract.gic');	await page.getByLabel('VeeAutomatedTesting (Civils)').getByRole('link', { name: '' }).click();
	await page.getByRole('menuitem', { name: 'Engineering' }).nth(1).click();
	await page.getByRole('textbox', { name: 'Contract Name*' }).click();
	await page.getByRole('textbox', { name: 'Contract Name*' }).fill('AUTO_TEST_CONTRACT_1');
	await page.getByRole('combobox', { name: 'Business Partner*' }).click();
	await page.getByRole('option', { name: 'VEE COMPANY PLANNING' }).click();

	await page.getByRole('combobox', { name: 'Start Date*', exact: true }).click();

	await page.getByRole('gridcell', { name: 'March 5' }).locator('a').waitFor({ state: 'visible' });
	await page.getByRole('gridcell', { name: 'March 5' }).locator('a').click();

	//SET DATES
	await page.getByRole('combobox', { name: 'Construction Start Date*' }).click();
	await page.waitForTimeout(250);
	await page
		.locator('#projectContractForm\\:contract-tab-view\\:constructionEngStartDate_panel')
		.waitFor({ state: 'visible' });
	await page
		.locator('#projectContractForm\\:contract-tab-view\\:constructionEngStartDate_panel')
		.getByRole('gridcell', { name: 'March 14' })
		.locator('a')
		.click();
	await page.waitForTimeout(200);
	await page.getByRole('combobox', { name: 'Construction End Date*' }).click();
	await page
		.locator('#projectContractForm\\:contract-tab-view\\:constructionEngSEndDate_panel')
		.waitFor({ state: 'visible' });
	await page
		.locator('#projectContractForm\\:contract-tab-view\\:constructionEngSEndDate_panel')
		.getByRole('gridcell', { name: 'March 31' })
		.locator('a')
		.click();
	await page.waitForTimeout(200);

	// SET SERVICES CHECKBOXES
	await page.locator('label[for="projectContractForm:contract-tab-view:serviceLevelTypeEnumList:0"]').click();
	await page.waitForTimeout(200);
	await page.locator('label[for="projectContractForm:contract-tab-view:serviceLevelTypeEnumList:1"]').click();
	await page.waitForTimeout(200);
	await page.locator('label[for="projectContractForm:contract-tab-view:serviceLevelTypeEnumList:2"]').click();
	await page.waitForTimeout(200);
	await page.locator('label[for="projectContractForm:contract-tab-view:serviceLevelTypeEnumList:3"]').click();
	await page.waitForTimeout(200);

	await page.locator('a[role="tab"]:has-text("Services")').click();
	await page.waitForTimeout(200);

	//projectContractForm:contract-tab-view:losDT:selectAllCheckbox
	await page.locator('[id="projectContractForm\\:contract-tab-view\\:losDT\\:selectAllCheckbox"]').click();
	await page.waitForTimeout(250);

	// Click the first cell in the row (td:nth-child(5)) and wait for input field to be enabled
	await page.locator('tr:nth-child(1) > td:nth-child(5)').first().click();
	await page.waitForTimeout(250);
	await page.locator('tr:nth-child(1) > td:nth-child(5)').first().type('R10,000');
	// Click the next cell (td:nth-child(6)) and wait for the input field to be enabled
	await page.waitForTimeout(250);

	await page.locator('tr:nth-child(1) > td:nth-child(6)').first().click();
	await page.waitForTimeout(250);
	await page.locator('tr:nth-child(1) > td:nth-child(6)').first().type('1');
	await page.waitForTimeout(250);

	// Click the next cell (td:nth-child(7)) and wait for the input field to be enabled
	await page.locator('tr:nth-child(1) > td:nth-child(7)').first().click();
	await page.waitForTimeout(250);
	await page.locator('tr:nth-child(1) > td:nth-child(7)').first().type('1');
	await page.waitForTimeout(250);

	await page.locator('tr:nth-child(2) > td:nth-child(5)').click();
	await page.waitForTimeout(250);
	await page.locator('tr:nth-child(2) > td:nth-child(5)').type('R10,000');
	await page.waitForTimeout(250);

	await page.locator('tr:nth-child(2) > td:nth-child(6)').click();
	await page.waitForTimeout(250);
	await page.locator('tr:nth-child(2) > td:nth-child(6)').type('1');
	await page.waitForTimeout(250);

	await page.locator('tr:nth-child(2) > td:nth-child(7)').click();
	await page.waitForTimeout(250);
	await page.locator('tr:nth-child(2) > td:nth-child(7)').type('1');
	await page.waitForTimeout(250);

	await page.locator('tr:nth-child(3) > td:nth-child(5)').click();
	await page.waitForTimeout(250);
	await page.locator('tr:nth-child(3) > td:nth-child(5)').type('R10,000');
	await page.waitForTimeout(250);

	await page.locator('tr:nth-child(3) > td:nth-child(6)').click();
	await page.waitForTimeout(250);
	await page.locator('tr:nth-child(3) > td:nth-child(6)').type('1');
	await page.waitForTimeout(250);

	await page.locator('tr:nth-child(3) > td:nth-child(7)').click();
	await page.waitForTimeout(250);
	await page.locator('tr:nth-child(3) > td:nth-child(7)').type('1');
	await page.waitForTimeout(250);

	await page.locator('tr:nth-child(4) > td:nth-child(5)').click();
	await page.waitForTimeout(250);
	await page.locator('tr:nth-child(4) > td:nth-child(5)').type('R10,000');
	await page.waitForTimeout(250);

	await page.locator('tr:nth-child(4) > td:nth-child(6)').click();
	await page.waitForTimeout(250);
	await page.locator('tr:nth-child(4) > td:nth-child(6)').type('1');
	await page.waitForTimeout(250);

	await page.locator('tr:nth-child(4) > td:nth-child(7)').click();
	await page.waitForTimeout(250);
	await page.locator('tr:nth-child(4) > td:nth-child(7)').type('1');
	await page.waitForTimeout(250);

	await page.locator('tr:nth-child(5) > td:nth-child(5)').click();
	await page.waitForTimeout(250);
	await page.locator('tr:nth-child(5) > td:nth-child(5)').type('R10,000');
	await page.waitForTimeout(250);

	await page.locator('tr:nth-child(5) > td:nth-child(6)').click();
	await page.waitForTimeout(250);
	await page.locator('tr:nth-child(5) > td:nth-child(6)').type('1');
	await page.waitForTimeout(250);

	await page.locator('tr:nth-child(5) > td:nth-child(7)').click();
	await page.waitForTimeout(250);
	await page.locator('tr:nth-child(5) > td:nth-child(7)').type('2');
	await page.waitForTimeout(250);

	await page.locator('tr:nth-child(6) > td:nth-child(5)').click();
	await page.waitForTimeout(250);
	await page.locator('tr:nth-child(6) > td:nth-child(5)').type('R5,000');
	await page.waitForTimeout(250);

	await page.locator('tr:nth-child(7) > td:nth-child(5)').click();
	await page.waitForTimeout(250);
	await page.locator('tr:nth-child(7) > td:nth-child(5)').type('R5,000');
	await page.waitForTimeout(250);

	await page.getByRole('gridcell', { name: '0', exact: true }).click();
	await page.waitForTimeout(250);
	await page.getByRole('gridcell', { name: '0', exact: true }).type('1');
	await page.waitForTimeout(250);

	await page.getByRole('tab', { name: 'Key Personnel' }).click();
	await page.getByRole('button', { name: '+ Add Resident Engineer' }).click({timeout:30000});
	await page.getByRole('combobox', { name: 'Resident Engineer*' }).click();
	await page.getByRole('option', { name: 'Vaughan Eng' }).click();
	await page.getByRole('button', { name: '💾 Submit' }).click();
	await page.getByRole('button', { name: '+ Add Professional Engineer' }).click();
	await page.getByRole('combobox', { name: 'Professional Engineer*' }).click();
	await page.getByRole('option', { name: 'VeePlan Eng' }).click();
	await page.getByRole('button', { name: '💾 Submit' }).click();
	await page.getByRole('button', { name: '+ Add Contact Person On Site' }).click();
	await page.getByRole('combobox', { name: 'Contact Person on Site*' }).click();
	await page.getByRole('option', { name: 'VeeTPlanner Owner' }).click();
	await page.getByRole('button', { name: '💾 Submit' }).click();

	await page.waitForTimeout(1500);
	await page.getByRole('button', { name: '+ Create Contract' }).click();
	await page.waitForTimeout(250);
	await page.getByRole('button', { name: 'Yes' }).click();


	console.log('SUCCESSFUL_FLOW_TEST_EXECUTION:5:28');

} catch (error) {
	console.log('FAILED_FLOW_TEST_EXECUTION:5:28');
	console.error(error.error?.message || error.message);
	throw error;
}

try {
	
	console.log('EXECUTING_FLOW_TEST_ID:5:17');

	await page.waitForURL('https://localhost:8080/pages/appointment-process/contract.gic');  // await page.getByRole('row', { name: /Expand Eastern Cape \(\d+\)/ }).getByLabel('Expand').click();
  // await page.getByRole('row', { name: '240502CS Boxwood - Orange' }).getByRole('link').click();
  // await page.getByRole('list').filter({ hasText: 'ActionsView Projects' }).locator('a').click();
  await page.getByLabel('VeeAutomatedTesting (Civils)').getByRole('link', { name: '' }).click();
  await page.getByRole('menuitem', { name: 'Delete Project' }).nth(1).click();
  await page.getByRole('button', { name: 'Yes' }).click();
  await expect(page.getByText('WarningProject Deleted')).toBeVisible();


	console.log('SUCCESSFUL_FLOW_TEST_EXECUTION:5:17');

} catch (error) {
	console.log('FAILED_FLOW_TEST_EXECUTION:5:17');
	console.error(error.error?.message || error.message);
	throw error;
}
});
