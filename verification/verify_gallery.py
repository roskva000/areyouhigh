from playwright.sync_api import sync_playwright

def verify_gallery():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            # Navigate to gallery where ExperienceCard is used
            page.goto("http://localhost:5173/gallery")
            # Wait for gallery to load
            page.wait_for_selector(".gallery-card")
            # Take a full page screenshot
            page.screenshot(path="verification/gallery_with_memo.png", full_page=True)
            print("Screenshot saved to verification/gallery_with_memo.png")
        except Exception as e:
            print(f"Error during verification: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_gallery()
