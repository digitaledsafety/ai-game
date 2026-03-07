from playwright.sync_api import sync_playwright
import time
import os

def run_test():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use absolute path for the file
        file_path = "file://" + os.path.abspath("index.html")
        page = browser.new_page()
        page.goto(file_path)

        # Wait for initialization
        time.sleep(2)

        # Check if welcome message is there
        output = page.locator("#output")
        print("Initial output:", output.inner_text())

        # Type help
        user_input = page.locator("#user-input")
        user_input.fill("help")
        user_input.press("Enter")

        # Wait for response (printSlow takes time)
        time.sleep(3)
        print("Output after help:", output.inner_text())

        # Test ls -l
        user_input.fill("ls -l")
        user_input.press("Enter")
        time.sleep(2)
        print("Output after ls -l:", output.inner_text())

        # Test touch and ls
        user_input.fill("touch newfile.txt")
        user_input.press("Enter")
        time.sleep(2)
        user_input.fill("ls")
        user_input.press("Enter")
        time.sleep(2)
        print("Output after touch and ls:", output.inner_text())

        # Check if newfile.txt is in ls output
        if "newfile.txt" in output.inner_text():
            print("SUCCESS: newfile.txt found in ls output")
        else:
            print("FAILURE: newfile.txt NOT found in ls output")

        browser.close()

if __name__ == "__main__":
    run_test()
