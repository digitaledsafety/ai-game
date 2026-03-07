const output = document.getElementById('output');
const userInput = document.getElementById('user-input');

const responses = [
    "That's interesting. Tell me more.",
    "I understand. How does that make you feel?",
    "Interesting perspective. I'll add that to my database.",
    "Could you elaborate on that?",
    "I see. Let's explore that further.",
    "That's a fascinating way to look at it.",
    "I'm processing that information. What's next?",
    "System check: All systems functional. Please continue.",
    "Interesting. My algorithms hadn't considered that.",
    "Can you provide more context on that topic?",
];

let history = [];
let historyIndex = -1;

async function printSlow(text, element, className = 'ai-text') {
    const span = document.createElement('span');
    span.className = className;
    element.appendChild(span);

    for (const char of text) {
        span.textContent += char;
        await new Promise(resolve => setTimeout(resolve, 30));
        output.scrollTop = output.scrollHeight;
    }
    element.appendChild(document.createElement('br'));
    output.scrollTop = output.scrollHeight;
}

async function handleInput(event) {
    if (event.key === 'Enter') {
        const text = userInput.value.trim();
        if (!text) return;

        history.push(text);
        historyIndex = -1;

        userInput.value = '';
        userInput.disabled = true;

        await printSlow(`> ${text}`, output, 'user-text');

        const command = text.toLowerCase();

        if (command === 'exit' || command === 'quit') {
            await printSlow("AI: It was a pleasure interacting with you. Goodbye!", output);
            return;
        } else if (command === 'clear') {
            output.innerHTML = '';
            userInput.disabled = false;
            userInput.focus();
            return;
        } else if (command === 'help') {
            await printSlow("Available commands: help, clear, exit, quit", output);
            userInput.disabled = false;
            userInput.focus();
            return;
        }

        await new Promise(resolve => setTimeout(resolve, 500));
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        await printSlow(`AI: ${randomResponse}`, output);

        userInput.disabled = false;
        userInput.focus();
    } else if (event.key === 'ArrowUp') {
        if (history.length > 0) {
            if (historyIndex === -1) {
                historyIndex = history.length - 1;
            } else if (historyIndex > 0) {
                historyIndex--;
            }
            userInput.value = history[historyIndex];
            event.preventDefault();
        }
    } else if (event.key === 'ArrowDown') {
        if (historyIndex !== -1) {
            if (historyIndex < history.length - 1) {
                historyIndex++;
                userInput.value = history[historyIndex];
            } else {
                historyIndex = -1;
                userInput.value = '';
            }
            event.preventDefault();
        }
    }
}

userInput.addEventListener('keydown', handleInput);

window.addEventListener('click', () => {
    userInput.focus();
});

window.onload = async () => {
    await printSlow("Initializing AI Experience...", output);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await printSlow("Welcome. I am an AI simulation designed to interact with you.", output);
    userInput.focus();
};
