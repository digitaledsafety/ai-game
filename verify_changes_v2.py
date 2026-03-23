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

        def clear_terminal():
            user_input.fill("clear")
            user_input.press("Enter")
            time.sleep(1)

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
            print(f"FAILURE: history navigation not reset, value: '{user_input.input_value()}'")

        clear_terminal()

        # Test echo spacing
        user_input.fill("echo   triple   space")
        user_input.press("Enter")
        time.sleep(2)
        if "Game:   triple   space" in output.inner_text():
            print("SUCCESS: echo spacing preserved correctly")
        else:
            print(f"FAILURE: echo spacing incorrect. Output: {output.inner_text()}")

        clear_terminal()

        # Test multiple touch and rm
        user_input.fill("touch file1 file2")
        user_input.press("Enter")
        time.sleep(2)
        clear_terminal()
        user_input.fill("ls")
        user_input.press("Enter")
        time.sleep(2)
        ls_output = output.inner_text()
        if "file1" in ls_output and "file2" in ls_output:
            print("SUCCESS: multiple touch worked")
        else:
            print(f"FAILURE: multiple touch failed. LS Output: {ls_output}")

        user_input.fill("rm file1 file2")
        user_input.press("Enter")
        time.sleep(2)
        clear_terminal()
        user_input.fill("ls")
        user_input.press("Enter")
        time.sleep(2)
        ls_output = output.inner_text()
        if "file1" not in ls_output and "file2" not in ls_output:
            print("SUCCESS: multiple rm worked")
        else:
            print(f"FAILURE: multiple rm failed. LS Output: {ls_output}")

        clear_terminal()

        # Test cp and mv
        user_input.fill("cp README.txt readme_copy.txt")
        user_input.press("Enter")
        time.sleep(2)
        clear_terminal()
        user_input.fill("ls")
        user_input.press("Enter")
        time.sleep(2)
        ls_output = output.inner_text()
        if "readme_copy.txt" in ls_output:
            print("SUCCESS: cp worked")
        else:
            print(f"FAILURE: cp failed. LS Output: {ls_output}")

        user_input.fill("mv readme_copy.txt readme_moved.txt")
        user_input.press("Enter")
        time.sleep(2)
        clear_terminal()
        user_input.fill("ls")
        user_input.press("Enter")
        time.sleep(2)
        ls_output = output.inner_text()
        if "readme_moved.txt" in ls_output and "readme_copy.txt" not in ls_output:
            print("SUCCESS: mv worked")
        else:
            print(f"FAILURE: mv failed. LS Output: {ls_output}")

        clear_terminal()

        # Test write
        user_input.fill("write newfile.txt Game Started")
        user_input.press("Enter")
        time.sleep(2)
        clear_terminal()
        user_input.fill("cat newfile.txt")
        user_input.press("Enter")
        time.sleep(2)
        if "Game Started" in output.inner_text():
            print("SUCCESS: write worked")
        else:
            print(f"FAILURE: write failed. Output: {output.inner_text()}")

        clear_terminal()

        # Test sudo
        user_input.fill("sudo any command")
        user_input.press("Enter")
        time.sleep(2)
        if "Permission denied" in output.inner_text():
            print("SUCCESS: sudo worked")
        else:
            print(f"FAILURE: sudo failed. Output: {output.inner_text()}")

        # Test Tab completion for new command (cp)
        user_input.fill("cp REA")
        page.keyboard.press("Tab")
        time.sleep(1)
        val = user_input.input_value()
        if val == "cp README.txt":
            print("SUCCESS: Tab completion for cp worked")
        else:
            print(f"FAILURE: Tab completion for cp failed, value: '{val}'")

        browser.close()

if __name__ == "__main__":
    run_test()
