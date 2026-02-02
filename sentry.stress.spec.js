import { test } from '@playwright/test';

const TARGET_URL = process.env.TARGET_URL || 'https://your-lms-url.com';

test('Sentry storage stress test', async ({ page }) => {
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

  // Trigger user interactions for replay
  for (let i = 0; i < 30; i++) {
    await page.mouse.move(
      Math.random() * 800,
      Math.random() * 600
    );
  }

  // Keep session alive a bit
  await page.waitForTimeout(3000);
});
