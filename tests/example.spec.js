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

// Test the test case all at one go
test('automated test for editing user profile', async ({ page }) => {
  await page.goto('http://localhost:8081/B/selectCountry.html');
  await page.locator('a:has-text("Singapore")').click();
  await page.locator('a:has-text("Login/Register")').click();

  // ----------------- Step 1: Open Member Profile Page -----------------
  await page.fill("#emailLogin", "dramatictan69@gmail.com");
  await page.fill("#passwordLogin", "12345678");
  await page.click('input[type="submit"]');

  // ----------------- Step 2: Edit user info -----------------
  // fill in fields
  await page.fill("#name", "Tan Guan Ying");
  await page.fill("#phone", "91234567");
  await page.selectOption("#country", "Singapore");
  await page.fill("#address", "Blk 123");
  await page.fill("#securityAnswer", "Mom");
  await page.fill("#age", '20');
  await page.fill("#income", "1200");

  // Step 3: Ignored the password fields

  const slaCheckbox = page.locator("#serviceLevelAgreement");
  if (!(await slaCheckbox.isChecked())) {
    await slaCheckbox.check();
  }

  // ----------------- Step 4: Click "submit" button -----------------
  await page.click('input[type="submit"]');

  // Expected Response: fields updated and a status stating, “Successfully Updated!”
  await expect(page.locator('#goodDiv')).toHaveText('Successfully Updated!');

  // ----------------- Step 5: Try updating password with empty new password -----------------
  // fill in password fields
  await page.fill("#oldPassword", "12345678");
  await page.click('input[type="submit"]');

  // Expected Response: System show status with “New Password cannot be empty.” and prevents password update
  await expect(page.locator('#errDiv')).toHaveText('New Password cannot be empty.');

  // ----------------- Step 6: Try leaving old password empty -----------------
  await page.fill("#password", "I_Love_SEP01!");
  await page.fill("#repassword", "I_Love_SEP01!");
  await page.click('input[type="submit"]');

  // System show status with “Please enter your old password to change it.” and prevents password update
  await expect(page.locator('#errDiv')).toHaveText('Please enter your old password to change it.');

  // ----------------- Step 7: Try entering the wrong password  -----------------
  await page.fill("#oldPassword", "WRONG_PW");
  await page.fill("#password", "I_Love_SEP01!");
  await page.fill("#repassword", "I_Love_SEP01!");
  await page.click('input[type="submit"]');

  // System show status with “Old password is incorrect.” and prevents password update
  await expect(page.locator('#errDiv')).toHaveText('Old password is incorrect.');

  // ----------------- Step 8: Enter current password correctly in “Old Password“ field -----------------
  await page.fill("#oldPassword", "12345678");

  // ----------------- Step 9:  Enter new password and re-enter password the desired new password -----------------
  await page.fill("#password", "I_Love_SEP01!");
  await page.fill("#repassword", "I_Love_SEP01!");

  // ----------------- Step 10: Click "Submit" button -----------------
  await page.click('input[type="submit"]');

  // Expected Response: Fields updated and a status stating, “Successfully Updated!”
  await expect(page.locator('#goodDiv')).toHaveText('Successfully Updated!');

  // ----------------- Step 11: Attempt to log in with old password -----------------
  await page.locator('a:has-text("Logout")').click(); // logout first
  await page.fill("#emailLogin", "dramatictan69@gmail.com");
  await page.fill("#passwordLogin", "12345678");
  await page.click('input[type="submit"]');

  // Expected Response: Login fails with a status message of “Login fail. Email or password is incorrect.” 
  await expect(page.locator('#errDiv')).toHaveText('Login fail. Email or password is incorrect.');

  // ---------------- Step 12: Log out and log in using new password ----------------
  await page.fill("#emailLogin", "dramatictan69@gmail.com");
  await page.fill("#passwordLogin", "I_Love_SEP01!");
  await page.click('input[type="submit"]');

  // Expected Response: Login succeeds using new password and automatically redirect to http://localhost:8081/B/SG/memberProfile.html
  await expect(page).toHaveURL('http://localhost:8081/B/SG/memberProfile.html');

  // Post-conditions: 
  // -	User profile particulars such as Name, Phone, Address, Challenge, Country, Security Question, Age and Income are updated in database
  // -	User password is updated in database if changed


  //-------------------------------- RESET TEST PASSWORD INFO ---------------------------------
  // fill in password fields
  await page.fill("#oldPassword", "I_Love_SEP01!");
  await page.fill("#password", "12345678");
  await page.fill("#repassword", "12345678");

  // click submit button
  await page.click('input[type="submit"]');

  // detect Fields updated and a status stating, “Successfully Updated!”
  await expect(page.locator('#goodDiv')).toHaveText('Successfully Updated!');

  // logout 
  await page.locator('a:has-text("Logout")').click();
})
