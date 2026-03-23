from playwright.sync_api import sync_playwright
import time
import os

def run_test():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        file_path = "file://" + os.path.abspath("index.html")
        page = browser.new_page()
        page.goto(file_path)

        # Wait for initialization
        time.sleep(3)

        output = page.locator("#output")
        user_input = page.locator("#user-input")

        # Test history navigation after clear-history
        user_input.fill("testcommand")
        user_input.press("Enter")
        time.sleep(1)
        user_input.fill("clear-history")
        user_input.press("Enter")
        time.sleep(2)
        user_input.focus()
        page.keyboard.press("ArrowUp")
        time.sleep(1)
        if user_input.input_value() == "":
            print("SUCCESS: history cleared and navigation reset")
        else:
            print(f"FAILURE: history navigation not reset, value: {user_input.input_value()}")

        # Test echo spacing
        user_input.fill("echo   triple   space")
        user_input.press("Enter")
        time.sleep(2)
        if "AI:   triple   space" in output.inner_text():
            print("SUCCESS: echo spacing preserved correctly")
        else:
            print(f"FAILURE: echo spacing incorrect. Output: {output.inner_text()}")

        # Test multiple touch and rm
        user_input.fill("touch file1 file2")
        user_input.press("Enter")
        time.sleep(2)
        user_input.fill("ls")
        user_input.press("Enter")
        time.sleep(2)
        if "file1" in output.inner_text() and "file2" in output.inner_text():
            print("SUCCESS: multiple touch worked")
        else:
            print("FAILURE: multiple touch failed")

        user_input.fill("rm file1 file2")
        user_input.press("Enter")
        time.sleep(2)
        user_input.fill("ls")
        user_input.press("Enter")
        time.sleep(2)
        if "file1" not in output.inner_text() and "file2" not in output.inner_text():
            print("SUCCESS: multiple rm worked")
        else:
            print("FAILURE: multiple rm failed")

        # Test cp and mv
        user_input.fill("cp README.txt readme_copy.txt")
        user_input.press("Enter")
        time.sleep(2)
        user_input.fill("ls")
        user_input.press("Enter")
        time.sleep(2)
        if "readme_copy.txt" in output.inner_text():
            print("SUCCESS: cp worked")
        else:
            print("FAILURE: cp failed")

        user_input.fill("mv readme_copy.txt readme_moved.txt")
        user_input.press("Enter")
        time.sleep(2)
        user_input.fill("ls")
        user_input.press("Enter")
        time.sleep(2)
        if "readme_moved.txt" in output.inner_text() and "readme_copy.txt" not in output.inner_text():
            print("SUCCESS: mv worked")
        else:
            print("FAILURE: mv failed")

        # Test write
        user_input.fill("write newfile.txt Hello World")
        user_input.press("Enter")
        time.sleep(2)
        user_input.fill("cat newfile.txt")
        user_input.press("Enter")
        time.sleep(2)
        if "Hello World" in output.inner_text():
            print("SUCCESS: write worked")
        else:
            print("FAILURE: write failed")

        # Test sudo
        user_input.fill("sudo any command")
        user_input.press("Enter")
        time.sleep(2)
        if "Permission denied" in output.inner_text():
            print("SUCCESS: sudo worked")
        else:
            print("FAILURE: sudo failed")

        # Test Tab completion for new command (cp)
        user_input.fill("cp REA")
        page.keyboard.press("Tab")
        time.sleep(1)
        if user_input.input_value() == "cp README.txt":
            print("SUCCESS: Tab completion for cp worked")
        else:
            print(f"FAILURE: Tab completion for cp failed, value: {user_input.input_value()}")

        browser.close()

if __name__ == "__main__":
    run_test()
