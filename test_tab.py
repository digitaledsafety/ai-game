from playwright.sync_api import sync_playwright
import time
import os

def run_test():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        file_path = "file://" + os.path.abspath("index.html")
        page = browser.new_page()
        page.goto(file_path)
        time.sleep(3)

        user_input = page.locator("#user-input")
        user_input.fill("cp REA")
        print(f"Filled: '{user_input.input_value()}'")

        # Try different ways to trigger Tab
        page.keyboard.press("Tab")
        time.sleep(1)
        print(f"After Tab press: '{user_input.input_value()}'")

        user_input.fill("cp ")
        user_input.type("REA")
        page.keyboard.press("Tab")
        time.sleep(1)
        print(f"After type and Tab: '{user_input.input_value()}'")

        browser.close()

if __name__ == "__main__":
    run_test()
