from playwright.sync_api import Page, expect, sync_playwright

def test_gallery_search_a11y(page: Page):
    page.goto("http://localhost:5173/gallery")

    # Wait for the search input by its newly added aria-label
    search_input = page.locator("input[aria-label='Search algorithms']")
    expect(search_input).to_be_visible(timeout=10000)

    # Focus the input to see the focus-visible styles
    search_input.focus()

    page.screenshot(path="verification/gallery_search_a11y.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 720})
        page = context.new_page()
        try:
            test_gallery_search_a11y(page)
        finally:
            browser.close()
