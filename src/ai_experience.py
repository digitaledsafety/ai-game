import sys
import time
import random

def print_slow(text, delay=0.01, end="\n"):
    for char in text:
        sys.stdout.write(char)
        sys.stdout.flush()
        time.sleep(delay)
    sys.stdout.write(end)
    sys.stdout.flush()

def main():
    print_slow("Initializing AI Experience...")
    time.sleep(0.5)
    print_slow("Welcome. I am an AI simulation designed to interact with you.")

    responses = [
        "That's interesting. Tell me more.",
        "I understand. How does that make you feel?",
        "Interesting perspective. I'll add that to my database.",
        "Could you elaborate on that?",
        "I see. Let's explore that further.",
    ]

    while True:
        try:
            user_input = input("\nYou: ")
            if user_input.lower() in ["exit", "quit", "bye"]:
                print_slow("AI: It was a pleasure interacting with you. Goodbye!")
                break

            print_slow("AI: ", end="")
            time.sleep(0.2)
            print_slow(random.choice(responses))

        except (KeyboardInterrupt, EOFError):
            print_slow("\nAI: Interaction terminated. Goodbye!")
            break

if __name__ == "__main__":
    main()
