import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 60_000,
  workers: Number(process.env.WORKERS || 10),
  use: {
    headless: false,
  },
});
