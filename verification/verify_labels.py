
import asyncio
from playwright.async_api import async_playwright
import os

async def verify_accessible_labels():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        try:
            # Navigate to the application
            print("Navigating to experience...")
            await page.goto("http://localhost:5173/experience/abyss", timeout=30000)

            # Wait for the lobby to load
            print("Waiting for lobby...")
            await page.wait_for_selector(".lobby-container", timeout=10000)

            # Check for Intensity slider
            print("Checking Intensity slider...")
            intensity_slider = page.locator('input[type="range"][aria-label="Intensity"]')
            if await intensity_slider.count() > 0:
                print("✅ Intensity slider found with aria-label='Intensity'")
                value_text = await intensity_slider.get_attribute("aria-valuetext")
                print(f"   Current aria-valuetext: {value_text}")
            else:
                print("❌ Intensity slider NOT found or missing aria-label")

            # Check for Glitch slider
            print("Checking Glitch slider...")
            glitch_slider = page.locator('input[type="range"][aria-label="Glitch"]')
            if await glitch_slider.count() > 0:
                print("✅ Glitch slider found with aria-label='Glitch'")
                value_text = await glitch_slider.get_attribute("aria-valuetext")
                print(f"   Current aria-valuetext: {value_text}")
            else:
                print("❌ Glitch slider NOT found or missing aria-label")

            # Screenshot
            if not os.path.exists("verification"):
                os.makedirs("verification")

            screenshot_path = "verification/lobby_sliders.png"
            await page.screenshot(path=screenshot_path)
            print(f"📸 Screenshot saved to {screenshot_path}")

        except Exception as e:
            print(f"Error during verification: {e}")
            if not os.path.exists("verification"):
                os.makedirs("verification")
            await page.screenshot(path="verification/error.png")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(verify_accessible_labels())
