from playwright.sync_api import sync_playwright

def test_ui(page):
    # 1. Start on Home
    page.goto("http://localhost:5173/")
    page.wait_for_timeout(2000)
    page.screenshot(path="verification/home.png")

    # 2. Go to Gallery
    page.goto("http://localhost:5173/gallery")
    page.wait_for_timeout(2000)
    page.screenshot(path="verification/gallery.png")

    # 3. Go to an Experience Lobby
    page.goto("http://localhost:5173/experience/classic_mandelbrot")
    page.wait_for_timeout(3000)
    page.screenshot(path="verification/lobby.png")

    # Check if the chat button is visible
    chat_btn = page.locator("button", has_text="Global Stream").first

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_ui(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
