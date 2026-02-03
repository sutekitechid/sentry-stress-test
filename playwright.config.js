import { defineConfig } from '@playwright/test';

const DURATION = parseInt(process.env.DURATION || '3000', 10);

export default defineConfig({
  timeout: DURATION + 30_000, // DURATION + 30 second buffer
  workers: Number(process.env.WORKERS || 10),
  fullyParallel: true,
  use: {
    headless: true,
  },
});
