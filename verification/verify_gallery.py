from playwright.sync_api import sync_playwright

def verify_gallery_search():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the gallery page
        page.goto("http://localhost:5173/gallery")

        # Wait for the page to load
        page.wait_for_selector("input[aria-label='Search algorithms']")

        # Type into the search input to trigger deferred value updates
        search_input = page.locator("input[aria-label='Search algorithms']")
        search_input.fill("fractal")

        # Wait a moment for React rendering
        page.wait_for_timeout(1000)

        # Take a screenshot to verify filtering works
        page.screenshot(path="verification/gallery_search.png")

        browser.close()

if __name__ == "__main__":
    verify_gallery_search()
