/* eslint-disable */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('Launching browser for authentication...');
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Navigating to Airbnb login page...');
  await page.goto('https://www.airbnb.com/login');

  console.log('Please log in manually in the browser window.');
  console.log('Waiting for you to reach the dashboard (URL contains "hosting" or "dashboard")...');

  // Wait for URL to change to something indicating login success
  try {
    await page.waitForURL(/.*airbnb\.com\/(hosting|dashboard|users\/show|become-a-host).*/, { timeout: 300000 }); // 5 mins timeout
    console.log('Login detected!');
  } catch (e) {
    console.log('Timeout waiting for login. Saving cookies anyway just in case.');
  }

  const cookies = await context.cookies();
  
  // Try to get localStorage, though it might be restricted in some contexts
  let localStorageData = {};
  try {
    const storage = await page.evaluate(() => JSON.stringify(localStorage));
    localStorageData = JSON.parse(storage);
  } catch (e) {
    console.log('Could not retrieve localStorage (might be empty or restricted).');
  }
  
  const sessionData = {
    cookies,
    localStorage: localStorageData
  };

  const sessionPath = path.join(__dirname, 'session_context.json');
  fs.writeFileSync(sessionPath, JSON.stringify(sessionData, null, 2));
  
  console.log(`Session context saved to ${sessionPath}`);
  
  await browser.close();
})();
