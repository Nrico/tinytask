import { test, expect } from "@playwright/test";

test.describe("{{ name }} tool interface tests", () => {
  test("should load tool page and verify elements", async ({ page }) => {
    await page.goto("/tools/{{ slug }}");
    
    // Check heading title
    const heading = page.locator("h1");
    await expect(heading).toContainText("{{ name }}");
    
    // Verify privacy note exists
    const privacyNote = page.locator("text=privacy");
    await expect(privacyNote).toBeVisible();
    
    // Verify preview card container exists
    const previewContainer = page.locator(".print\\:block").first();
    await expect(previewContainer).toBeVisible();
  });
});
