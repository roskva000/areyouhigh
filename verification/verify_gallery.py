from playwright.sync_api import sync_playwright
import time

def verify_gallery():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print("Navigating to Gallery...")
        page.goto("http://localhost:5173/gallery")
        page.wait_for_selector(".gallery-card") # Wait for cards to load

        print("Taking Gallery Screenshot...")
        page.screenshot(path="verification/gallery_view.png")

        # Click first experience to check Lobby
        print("Clicking first experience...")
        page.click(".gallery-card:first-child")

        # Wait for lobby transition
        page.wait_for_timeout(2000)

        print("Verifying Lobby elements...")
        # Check for Artifact Logs (Comments)
        if page.is_visible("text=Artifact Logs"):
            print("Artifact Logs found.")
        else:
            print("Artifact Logs NOT found.")

        # Check for Like button
        if page.is_visible("button:has(svg.lucide-thumbs-up)"):
             print("Like button found.")
        else:
             print("Like button NOT found.")

        # Check for Global Chat button
        print("Waiting for Global Chat button...")
        # Wait for the button to be attached and visible.
        # The selector targets the button wrapper or the SVG directly.
        # Given the component structure: <button ...> <MessageCircle ...> </button>
        try:
             chat_btn_selector = "button:has(svg.lucide-message-circle)"
             page.wait_for_selector(chat_btn_selector, state='visible', timeout=5000)
             print("Global Chat button found.")

             chat_btn = page.locator(chat_btn_selector)

             # Force click because sometimes overlays/animations might interfere slightly
             chat_btn.click(force=True)

             # Wait for panel to animate in (gsap duration is 0.5s)
             page.wait_for_timeout(1000)
             page.screenshot(path="verification/chat_view.png")
             print("Chat opened and screenshot taken.")
        except Exception as e:
             print(f"Global Chat verification failed: {e}")
             # Take a debug screenshot to see what's happening
             page.screenshot(path="verification/debug_chat_fail.png")

        browser.close()

if __name__ == "__main__":
    verify_gallery()
