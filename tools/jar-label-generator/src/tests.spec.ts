import { test, expect } from "@playwright/test";

test.describe("Jar Label Generator tool interface tests", () => {
  test("should load tool page and verify elements", async ({ page }) => {
    await page.goto("/tools/jar-label-generator");
    
    // Check heading title
    const heading = page.locator("h1");
    await expect(heading).toContainText("Jar Label Generator");
    
    // Verify privacy note exists
    const privacyNote = page.locator("text=privacy");
    await expect(privacyNote).toBeVisible();
    
    // Verify preview card container exists
    const previewContainer = page.locator(".print\\:block");
    await expect(previewContainer).toBeVisible();
  });
});
