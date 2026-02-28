from playwright.sync_api import sync_playwright

def test_frontend():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Test 404 page
        page.goto("http://localhost:5173/random-page-that-does-not-exist")
        page.wait_for_selector("text=404")
        page.screenshot(path="/tmp/404.png")

        # Test Global Chat on Home Page
        page.goto("http://localhost:5173/")

        # Wait for chat trigger
        chat_trigger = page.locator("button").filter(has_text="") # the lucide icon doesn't have text
        # Since it's fixed bottom right, we can try to find the button with right-6 bottom-6 classes
        chat_button = page.locator("button[class*='fixed bottom-6 right-6']")

        if chat_button.count() > 0:
            chat_button.first.click()
            page.wait_for_timeout(1000) # wait for animation
            page.screenshot(path="/tmp/chat.png")

        browser.close()

if __name__ == "__main__":
    test_frontend()
