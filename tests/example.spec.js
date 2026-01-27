// @ts-check
import { test, expect } from '@playwright/test';

/* These test to open the official playwright website, it is not required for our testing
test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
*/

//---------------------------------------
// Tests developed by Guan Ying
// login
// npx playwright test --project=webkit --headed
test('login', async ({ page }) => {
  await page.goto('http://localhost:8081/B/selectCountry.html');
  await page.locator('a:has-text("Singapore")').click();
  await page.locator('a:has-text("Login/Register")').click();

  // login
  await page.fill("#emailLogin", "dramatictan69@gmail.com");
  await page.fill("#passwordLogin", "12345678");
  await page.click('input[type="submit"]');
})

// Edit user information (e.g. Name, Phone, Address, Country, Security Question, Age, Income without changing password)
test('edit personal information', async ({ page }) => {
  await page.goto('http://localhost:8081/B/selectCountry.html');
  await page.locator('a:has-text("Singapore")').click();
  await page.locator('a:has-text("Login/Register")').click();

  // login
  await page.fill("#emailLogin", "dramatictan69@gmail.com");
  await page.fill("#passwordLogin", "12345678");
  await page.click('input[type="submit"]');

  // fill in fields
  await page.fill("#name", "Tan Guan Ying");
  await page.fill("#phone", "91234567");
  await page.selectOption("#country", "Singapore");
  await page.fill("#address", "Blk 123");
  await page.fill("#securityAnswer", "Mom");
  await page.fill("#age", '20');
  await page.fill("#income", "1200");

  const slaCheckbox = page.locator("#serviceLevelAgreement");
  if (!(await slaCheckbox.isChecked())) {
    await slaCheckbox.check();
  }

  // click submit button
  await page.click('input[type="submit"]');

  // detect Fields updated and a status stating, “Successfully Updated!”
  await expect(page.locator('#goodDiv')).toHaveText('Successfully Updated!');
})

// enter password 
test('update password', async ({ page }) => {
  
})