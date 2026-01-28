// @ts-check
import { test, expect } from '@playwright/test';
import { waitForDebugger } from 'node:inspector';




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