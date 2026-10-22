import { expect, test } from "@playwright/test";

test("login shows the KPI cards and the dealer ranking, and logout locks the dashboard", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("gerencia@australmotors.test");
  await page.getByLabel("Contraseña").fill("redpulse-demo");
  await page.getByRole("button", { name: "Ingresar" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);

  for (const label of ["Leads", "Primera respuesta", "Test drives", "Conversión"]) {
    await expect(page.getByRole("article", { name: label })).toBeVisible();
  }
  await expect(page.getByText("Valentina Ríos")).toBeVisible();

  await expect(page.getByRole("heading", { name: "Red de concesionarios" })).toBeVisible();
  const rows = page.getByRole("table").locator("tbody tr");
  await expect(rows).toHaveCount(12);

  const quilmes = rows.filter({ hasText: "Austral Quilmes" });
  await expect(quilmes).toContainText("Crítico");

  await page.getByRole("button", { name: "Cerrar sesión" }).click();
  await expect(page).toHaveURL(/\/login$/);

  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login$/);
});
