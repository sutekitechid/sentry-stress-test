import { test } from '@playwright/test';

const TARGET_URL = process.env.TARGET_URL || 'https://your-lms-url.com';
const DURATION = parseInt(process.env.DURATION || '3000', 10);
const WORKERS = parseInt(process.env.WORKERS || '10', 10);

// Generate multiple tests based on WORKERS count
for (let workerIndex = 0; workerIndex < WORKERS; workerIndex++) {
  test(`Sentry storage stress test - Worker ${workerIndex + 1}`, async ({ page }) => {
  await page.goto(TARGET_URL);

  // Trigger network payload
  await page.evaluate(async () => {
    for (let i = 0; i < 20; i++) {
      fetch('/api/dummy-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          index: i,
          payload: 'x'.repeat(5000),
          timestamp: Date.now(),
        }),
      }).catch(() => {});
    }
  });

  // Trigger JS errors for Sentry capture
  await page.evaluate(() => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        // intentional error
        (window).nonExistingFunction();
      }, i * 200);
    }
  });

  // Keep session alive with continuous random form interactions
  const startTime = Date.now();
  while (Date.now() - startTime < DURATION) {
    const randomUsername = `user_${Math.random().toString(36).substring(7)}`;
    const randomPassword = `pass_${Math.random().toString(36).substring(7)}`;
    
    await page.fill('input[placeholder="Username"]', randomUsername);
    await page.fill('input[placeholder="Password"]', randomPassword);

    await page.click('button:has-text("Login Civitas LMS")');
    
    await page.waitForTimeout(2000);
  }
  });
}
