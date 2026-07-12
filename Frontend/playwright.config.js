import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "./e2e",
  timeout: 30000,
  fullyParallel: true,
  webServer: {
    command: "npm run dev -- --port 5173",
    url: "http://localhost:5173",
    reuseExistingServer: true,
    timeout: 30000
  },
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry"
  }
})
