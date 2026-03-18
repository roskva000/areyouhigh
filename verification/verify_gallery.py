from playwright.sync_api import sync_playwright

def verify():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto('http://localhost:3000/gallery')
            page.wait_for_selector('.gallery-card', timeout=5000)

            # Take screenshot of the initial load
            page.screenshot(path='verification/gallery_initial.png', full_page=True)

            # Test search filter (typing quickly)
            search_input = page.get_by_role("textbox", name="Search algorithms")
            search_input.fill("fractal")

            # Wait a bit for the deferred value to catch up and filter to apply
            page.wait_for_timeout(500)

            # Take screenshot of the filtered view
            page.screenshot(path='verification/gallery_filtered.png', full_page=True)

        finally:
            browser.close()

if __name__ == '__main__':
    verify()
