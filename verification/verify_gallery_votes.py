import time
from playwright.sync_api import sync_playwright

def verify_gallery_votes():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the gallery page
        print("Navigating to Gallery...")
        page.goto("http://localhost:5173/gallery")

        # Wait for the gallery content to load and animations to settle
        print("Waiting for gallery to load...")
        time.sleep(5)
        # page.wait_for_selector(".gallery-card", state="visible")
        time.sleep(3) # Allow GSAP animations to complete

        # Take a screenshot of the gallery
        print("Taking screenshot...")
        page.screenshot(path="verification/gallery_votes_view.png", full_page=True)

        # Verify if heart icons are visible
        hearts = page.locator("svg.text-red-500")
        count = hearts.count()
        print(f"Found {count} heart icons.")

        browser.close()

if __name__ == "__main__":
    verify_gallery_votes()
