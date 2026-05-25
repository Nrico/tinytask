import { test, expect } from "@playwright/test";

test.describe("Jar Label Generator tool interface tests", () => {
  test("should load tool page and verify elements", async ({ page }) => {
    await page.goto("/tools/jar-label-generator");
    
    // Check heading title
    const heading = page.locator("h1");
    await expect(heading).toContainText("Jar Label Generator");
    
    // Verify privacy note exists
    const privacyNote = page.locator("text=Privacy Note");
    await expect(privacyNote).toBeVisible();
    
    // Verify preview card container exists
    const previewContainer = page.locator(".print\\:block").first();
    await expect(previewContainer).toBeVisible();
  });

  test("should verify all tool links on the main page", async ({ page }) => {
    await page.goto("/");
    
    // Get all tool link elements from the grid
    const cards = page.locator("a[href^='/tools/']");
    const count = await cards.count();
    console.log(`Found ${count} tool links on the homepage.`);
    
    expect(count).toBeGreaterThan(0);

    const hrefs: string[] = [];
    for (let i = 0; i < count; i++) {
      const href = await cards.nth(i).getAttribute("href");
      if (href) hrefs.push(href);
    }

    // Visit every single link and verify it loads the tool page correctly
    for (const href of hrefs) {
      console.log(`Testing navigation to ${href}...`);
      await page.goto(href);
      
      // Check that we get a heading on the page
      const heading = page.locator("h1, h2").first();
      await expect(heading).toBeVisible({ timeout: 5000 });
      const titleText = await heading.innerText();
      console.log(`Successfully loaded: ${titleText}`);
      
      // Verify it doesn't contain "404" or "Not Found"
      expect(titleText.toLowerCase()).not.toContain("404");
      expect(titleText.toLowerCase()).not.toContain("not found");
    }
  });
});
