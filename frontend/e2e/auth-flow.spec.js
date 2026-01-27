import { expect, test } from "@playwright/test";

test("login admin puis accès contenu", async ({ page }) => {
  const username = process.env.E2E_USERNAME || "pleaseDefineItInDotEnvDotLocal";
  const password = process.env.E2E_PASSWORD || "pleaseDefineItInDotEnvDotLocal";

  await page.goto("/");

  await page.getByLabel("Nom d'utilisateur").fill(username);
  await page.getByLabel("Mot de passe").fill(password);
  await page.getByRole("button", { name: "Se connecter" }).click();

  await expect(
    page.getByRole("button", { name: "Se déconnecter" }),
  ).toBeVisible();
  await expect(page.getByText(/Backend says/i)).toBeVisible();
});
