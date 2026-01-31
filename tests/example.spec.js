// @ts-check
import { test, expect } from '@playwright/test';
import { waitForDebugger } from 'node:inspector';

/* These test to open the official playwright website, it is not required for our testing
test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

*/




// ===========================================================
// Teo Hock Yong Ignatius
// ===========================================================
test('login fails with wrong email', async ({ page }) => {
  await page.goto('http://localhost:8081/B/selectCountry.html');
  await page.locator('a:has-text("Singapore")').click();
  await page.locator('a:has-text("Login/Register")').click();

  // Fill in invalid credentials
  await page.fill('#emailLogin', 'wrong@example.com');
  await page.fill('#passwordLogin', 'junwei123');
  // Click login
  await page.click('input[value="Login"]');

  // Wait for redirect with error message in URL
  await expect(page).toHaveURL(/errMsg=Login%20fail\.%20Email%20or%20password%20is%20incorrect\./);

  // Assert error message is visible on page
  await expect(
    page.locator('text=Login fail. Email or password is incorrect.')
  ).toBeVisible();
});

test('login fails with wrong password', async ({ page }) => {
  await page.goto('http://localhost:8081/B/selectCountry.html');
  await page.locator('a:has-text("Singapore")').click();
  await page.locator('a:has-text("Login/Register")').click();

  // Fill in invalid credentials
  await page.fill('#emailLogin', 'junwei10255@gmail.com');
  await page.fill('#passwordLogin', 'wrongpassword');

  // Click login
  await page.click('input[value="Login"]');

  // Wait for redirect with error message in URL
  await expect(page).toHaveURL(/errMsg=Login%20fail\.%20Email%20or%20password%20is%20incorrect\./);

  // Assert error message is visible on page
  await expect(
    page.locator('text=Login fail. Email or password is incorrect.')
  ).toBeVisible();
});

test('member profile form is auto-filled after login', async ({ page }) => {
  // login
  await page.goto('http://localhost:8081/B/selectCountry.html');
  await page.locator('a:has-text("Singapore")').click();
  await page.locator('a:has-text("Login/Register")').click();
  await page.fill('#emailLogin', 'junwei10255@gmail.com');
  await page.fill('#passwordLogin', 'junwei123');
  await page.getByRole('button', { name: 'Login' }).click();

  // 3. Wait for redirect
  await page.waitForURL(
    'http://localhost:8081/B/SG/memberProfile.html',
    { timeout: 10000 }
  );
  
  // 5. Assertions — auto-filled form
  await expect(page.locator('#email')).toHaveValue('junwei10255@gmail.com');
  await expect(page.locator('#name')).toHaveValue('Jun Wei');
  await expect(page.locator('#phone')).toHaveValue('98318888');
  await expect(page.locator('#address')).toHaveValue('Toa Payoh Lor 2');
  await expect(page.locator('#country')).toHaveValue('Singapore');
  await expect(page.locator('#securityQuestion')).toHaveValue('2');
  await expect(page.locator('#securityAnswer')).toHaveValue('dog/cat'); 
  await expect(page.locator('#age')).toHaveValue('19');
  await expect(page.locator('#income')).toHaveValue('5060');
  await expect(page.locator('#serviceLevelAgreement')).toHaveValue('agreement');


  // 6. Navigation bar - check status
  await expect(page.locator('#memberName')).toHaveText('Welcome Jun Wei!');
});




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
  await page.fill("#emailLogin", "junwei10255@gmail.com");
  await page.fill("#passwordLogin", "junwei123");
  await page.click('input[type="submit"]');

  // ----------------- Step 2: Edit user info -----------------
  // fill in fields
  await page.fill("#name", "Tan Guan Ying");
  await page.fill("#phone", "91234567");
  await page.selectOption("#country", "Singapore");
  await page.fill("#address", "Blk 123");
  await page.fill("#securityAnswer", "duck");
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
  await page.fill("#oldPassword", "junwei123");
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
  await page.fill("#oldPassword", "junwei123");

  // ----------------- Step 9:  Enter new password and re-enter password the desired new password -----------------
  await page.fill("#password", "I_Love_SEP01!");
  await page.fill("#repassword", "I_Love_SEP01!");

  // ----------------- Step 10: Click "Submit" button -----------------
  await page.click('input[type="submit"]');

  // Expected Response: Fields updated and a status stating, “Successfully Updated!”
  await expect(page.locator('#goodDiv')).toHaveText('Successfully Updated!');

  // ----------------- Step 11: Attempt to log in with old password -----------------
  await page.locator('a:has-text("Logout")').click(); // logout first
  await page.fill("#emailLogin", "junwei10255@gmail.com");
  await page.fill("#passwordLogin", "junwei123");
  await page.click('input[type="submit"]');

  // Expected Response: Login fails with a status message of “Login fail. Email or password is incorrect.” 
  await expect(page.locator('#errDiv')).toHaveText('Login fail. Email or password is incorrect.');

  // ---------------- Step 12: Log out and log in using new password ----------------
  await page.fill("#emailLogin", "junwei10255@gmail.com");
  await page.fill("#passwordLogin", "I_Love_SEP01!");
  await page.click('input[type="submit"]');

  // Expected Response: Login succeeds using new password and automatically redirect to http://localhost:8081/B/SG/memberProfile.html
  await expect(page).toHaveURL('http://localhost:8081/B/SG/memberProfile.html');

  // Post-conditions: 
  // -	User profile particulars such as Name, Phone, Address, Challenge, Country, Security Question, Age and Income are updated in database
  // -	User password is updated in database if changed


  //-------------------------------- RESET TEST PASSWORD INFO ---------------------------------
  // RESET fields to junwei
  await page.fill("#name", "Jun Wei");
  await page.fill("#phone", "98318888");
  await page.selectOption("#country", "Singapore");
  await page.fill("#address", "Toa Payoh Lor 2");
  await page.fill("#securityAnswer", "dog/cat");
  await page.fill("#age", '19');
  await page.fill("#income", "5060");
  // fill in password fields
  await page.fill("#oldPassword", "I_Love_SEP01!");
  await page.fill("#password", "junwei123");
  await page.fill("#repassword", "junwei123");

  // click submit button
  await page.click('input[type="submit"]');

  // detect Fields updated and a status stating, “Successfully Updated!”
  await expect(page.locator('#goodDiv')).toHaveText('Successfully Updated!');

  // logout 
  await page.locator('a:has-text("Logout")').click();
})

// ===========================================================
// Javier Tan Jia Ye
// ===========================================================
test('Sales History', async ({ page }) => {

  // login
  await page.goto('http://localhost:8081/B/selectCountry.html');
  await page.getByText('Singapore').click();
  await page.getByText('Login/Register').click();
  await page.fill('#emailLogin', 'junwei10255@gmail.com');
  await page.fill('#passwordLogin', 'junwei123');
  await page.getByRole('button', { name: 'Login' }).click();


  // verify order display
  await page.getByRole('link', { name: 'Sales History' }).click();
  const tabs = page.locator('.tab-content').locator('#salesHistory');
  const testIds = tabs.locator('[data-testid]');
  const count = await testIds.count();
  console.log(`Sales History: Found ${count} orders`);
  // verify that there is at least 1 order 
  expect(count).toBeGreaterThan(0);

  
  // buy an item
  await page.goto('http://localhost:8081/B/SG/furnitureCategory.html?cat=Tables%20%26%20Desks');
  const linmon = page.locator('li.product').filter({ has: page.getByRole('heading', { name: 'LINMON' })});
  await linmon.getByRole('button', { name: 'Add To Cart' }).click();
  await expect(page.getByText('Successfully added!')).toBeVisible();

  await page.goto('http://localhost:8081/B/SG/shoppingCart.html');
  const cartItem = page.locator('#cartBody tr.cart_table_item');
  await expect(cartItem).toHaveClass(/cart_table_item/);
  await page.getByRole('button', { name: 'Check Out' }).click();

  await page.locator('#checkoutModal').locator('.modal-footer').getByRole('button', { name: 'Confirm' }).click();
  const paymentForm = page.locator('#makePaymentForm');
  const display = await paymentForm.evaluate(el => getComputedStyle(el).display);
  expect(display).toBe('block');

  const chooseCard = page.locator('#chooseCardDiv .pretty.p-icon.p-round');
  await chooseCard.nth(2).locator('input[type="radio"]').check();
  await chooseCard.nth(2).locator('input[type="radio"]').click();
  await paymentForm.getByRole('button', { name: 'Make Payment' }).click();
  await expect(page.getByText('Successfully Paid')).toBeVisible();

  // verify new order in sales history
  await page.goto("http://localhost:8081/B/SG/memberProfile.html");
  await page.getByRole('link', { name: 'Sales History' }).click();
  const tabs2 = page.locator('.tab-content').locator('#salesHistory');
  const testIds2 = tabs2.locator('[data-testid]');
  const count2 = await testIds2.count();
  console.log(`Sales History: Found ${count2} orders after purchase`);
  expect(count2).toBeGreaterThan(count);
  
});




