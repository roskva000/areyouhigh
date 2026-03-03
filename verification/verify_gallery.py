from playwright.sync_api import sync_playwright

def test_gallery(page):
    page.goto("http://localhost:5173/gallery")
    page.wait_for_selector(".gallery-card")
    page.screenshot(path="verification/gallery.png")

    # Type in search bar
    search_input = page.locator("input[placeholder='Search algorithms...']")
    search_input.fill("fractal")
    page.wait_for_timeout(1000)
    page.screenshot(path="verification/gallery-search.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_gallery(page)
        finally:
            browser.close()