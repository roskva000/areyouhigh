import time
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to home just to check if server is rendering anything
        page.goto("http://localhost:3000")
        time.sleep(2)

        page.screenshot(path="verification/home.png")
        print("Captured Home")

        browser.close()

if __name__ == "__main__":
    run()
