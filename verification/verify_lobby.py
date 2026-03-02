from playwright.sync_api import sync_playwright

def verify_experience_lobby():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Create context with a modern user agent
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = context.new_page()

        try:
            # Navigate to the local dev server experience page
            # We assume it's running on port 5173
            page.goto("http://localhost:5173/experience/mandelbulb")

            # Wait for the lobby to load
            page.wait_for_selector(".lobby-container", timeout=10000)

            # Take a screenshot
            page.screenshot(path="verification/lobby.png")
            print("Screenshot saved to verification/lobby.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_experience_lobby()
