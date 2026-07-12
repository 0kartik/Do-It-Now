import { test, expect } from "@playwright/test"

// This suite exercises the full stack (frontend + backend + real MongoDB).
// It expects:
//   - the backend running at the URL in Frontend/.env's VITE_API_URL
//   - a clean/dedicated test database (each run registers a fresh random user)
// Run with: npx playwright test

function uniqueEmail() {
  return `e2e-${Date.now()}-${Math.floor(Math.random() * 10000)}@example.com`
}

test("register -> add habit -> complete it -> see streak of 1", async ({ page }) => {
  const email = uniqueEmail()

  await page.goto("/login")
  await page.getByText("Need an account? Register").click()

  await page.getByPlaceholder("Name").fill("E2E Test User")
  await page.getByPlaceholder("Email").fill(email)
  await page.getByPlaceholder("Password").fill("password123")
  await page.getByRole("button", { name: "Register" }).click()

  // Should land on the home page, logged in
  await expect(page.getByText(/Signed in as/)).toBeVisible()

  await page.goto("/habits")
  await page.getByPlaceholder("e.g., Morning Exercise").fill("Read for 20 minutes")
  await page.getByRole("button", { name: "Add Habit" }).click()

  await expect(page.getByText("Read for 20 minutes")).toBeVisible()

  // Complete it - there's a confirm() dialog in the app, auto-accept it
  page.on("dialog", dialog => dialog.accept())
  await page.getByRole("button", { name: "Mark Complete" }).click()

  await expect(page.getByText("1 days")).toBeVisible()
  await expect(page.getByText("✓ Done Today")).toBeVisible()
})

test("register -> add task -> mark done -> shows in completed count", async ({ page }) => {
  const email = uniqueEmail()

  await page.goto("/login")
  await page.getByText("Need an account? Register").click()
  await page.getByPlaceholder("Name").fill("E2E Test User")
  await page.getByPlaceholder("Email").fill(email)
  await page.getByPlaceholder("Password").fill("password123")
  await page.getByRole("button", { name: "Register" }).click()

  await page.goto("/today")
  await page.locator("#task-input").fill("Buy groceries")
  await page.getByRole("button", { name: "Add Task" }).click()

  await expect(page.getByText("Buy groceries")).toBeVisible()

  await page.getByRole("button", { name: "Done" }).click()
  await expect(page.getByText("Completed: 1")).toBeVisible()
})

test("logging out redirects to login and blocks protected pages", async ({ page }) => {
  const email = uniqueEmail()

  await page.goto("/login")
  await page.getByText("Need an account? Register").click()
  await page.getByPlaceholder("Name").fill("E2E Test User")
  await page.getByPlaceholder("Email").fill(email)
  await page.getByPlaceholder("Password").fill("password123")
  await page.getByRole("button", { name: "Register" }).click()

  await page.getByRole("button", { name: "Log out" }).click()
  await expect(page).toHaveURL(/\/login/)

  await page.goto("/habits")
  await expect(page).toHaveURL(/\/login/)
})
