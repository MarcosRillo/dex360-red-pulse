import { expect, test } from "@playwright/test";

const EMAIL = "gerencia@australmotors.test";
const PASSWORD = "redpulse-demo";

async function signIn(page: import("@playwright/test").Page, password: string) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(EMAIL);
  await page.getByLabel("Contraseña").fill(password);
  await page.getByRole("button", { name: "Ingresar" }).click();
}

test("visiting /dashboard without a session lands on /login", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("button", { name: "Ingresar" })).toBeVisible();
});

test("a wrong password shows the API error inline", async ({ page }) => {
  await signIn(page, "incorrecta");

  // Next renders an empty route announcer with role=alert, so filter by text.
  await expect(page.getByRole("alert").filter({ hasText: "Email o contraseña incorrectos" })).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});

test("a valid login lands on /dashboard", async ({ page }) => {
  await signIn(page, PASSWORD);

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: /Valentina Ríos/ })).toBeVisible();
});

test("logout returns to /login and /dashboard redirects again", async ({ page }) => {
  await signIn(page, PASSWORD);
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.getByRole("button", { name: "Cerrar sesión" }).click();
  await expect(page).toHaveURL(/\/login$/);

  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login$/);
});
