from playwright.sync_api import sync_playwright
import time

def verify_experiences():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Visit Home
        page.goto("http://localhost:5173")
        time.sleep(2) # Wait for animations
        page.screenshot(path="verification/01_home.png")
        print("Captured Home")

        # 2. Visit Fractal (Previously standalone)
        page.goto("http://localhost:5173/experience/fractal")
        time.sleep(3) # Wait for shader to compile and render
        page.screenshot(path="verification/02_fractal_lobby.png")
        print("Captured Fractal Lobby")

        # Interact: Click "Initialize System" to start experience
        page.get_by_role("button", name="INITIALIZE SYSTEM").click()
        time.sleep(3) # Wait for transition and briefing
        page.screenshot(path="verification/03_fractal_active.png")
        print("Captured Fractal Active")

        # 3. Visit Particles (Special Points Mode)
        page.goto("http://localhost:5173/experience/particles")
        time.sleep(3)
        page.get_by_role("button", name="INITIALIZE SYSTEM").click()
        time.sleep(3)
        page.screenshot(path="verification/04_particles_active.png")
        print("Captured Particles Active")

        browser.close()

if __name__ == "__main__":
    verify_experiences()
