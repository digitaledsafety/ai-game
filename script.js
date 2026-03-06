const output = document.getElementById('output');
const userInput = document.getElementById('user-input');

const responses = [
    "That's interesting. Tell me more.",
    "I understand. How does that make you feel?",
    "Interesting perspective. I'll add that to my database.",
    "Could you elaborate on that?",
    "I see. Let's explore that further.",
];

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
}

async function handleInput(event) {
    if (event.key === 'Enter') {
        const text = userInput.value.trim();
        if (!text) return;

        userInput.value = '';
        userInput.disabled = true;

        await printSlow(`> ${text}`, output, 'user-text');

        if (text.toLowerCase() === 'exit' || text.toLowerCase() === 'quit') {
            await printSlow("AI: It was a pleasure interacting with you. Goodbye!", output);
            return;
        }

        await new Promise(resolve => setTimeout(resolve, 500));
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        await printSlow(`AI: ${randomResponse}`, output);

        userInput.disabled = false;
        userInput.focus();
    }
}

userInput.addEventListener('keydown', handleInput);

window.onload = async () => {
    await printSlow("Initializing AI Experience...", output);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await printSlow("Welcome. I am an AI simulation designed to interact with you.", output);
    userInput.focus();
};
