from playwright.sync_api import sync_playwright, expect
import time

def test_gallery_search():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to gallery
        page.goto("http://localhost:5173/gallery")

        # Wait for experiences to load
        page.wait_for_selector(".gallery-card")

        # Find search input
        search_input = page.get_by_role("textbox", name="Search algorithms")

        # Type "fractal" slowly to simulate fast typing and verify UI doesn't freeze
        search_input.type("fractal", delay=50)

        # Wait for a moment to let deferred value update
        time.sleep(1)

        # Take a screenshot to verify filtering worked
        page.screenshot(path="verification/gallery_search.png")

        browser.close()

if __name__ == "__main__":
    test_gallery_search()
