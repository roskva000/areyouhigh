from playwright.sync_api import Page, expect, sync_playwright

def test_global_chat(page: Page):
    page.goto("http://localhost:5173/")

    # Wait for the chat toggle button to be visible
    chat_toggle_btn = page.locator("button[aria-label='Toggle Global Chat']")
    expect(chat_toggle_btn).to_be_visible(timeout=10000)

    # Click to open chat
    chat_toggle_btn.click()

    # Wait for chat panel to open and check for input field and send button
    chat_input = page.locator("input[aria-label='Chat message']")
    expect(chat_input).to_be_visible(timeout=5000)

    send_btn = page.locator("button[aria-label='Send message']")
    expect(send_btn).to_be_visible(timeout=5000)

    # Focus the input to see the focus-visible styles
    chat_input.focus()

    page.screenshot(path="verification/global_chat_a11y.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 720})
        page = context.new_page()
        try:
            test_global_chat(page)
        finally:
            browser.close()