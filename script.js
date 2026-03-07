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
    "Data analysis suggests several possibilities. What's your priority?",
    "I'm learning more about human behavior every day.",
    "That aligns with my current data models.",
    "Interesting. Let's dig deeper into that.",
    "I'm here to assist. What else is on your mind?",
    "That's a valid point. I'll remember that.",
];

let history = [];
let historyIndex = -1;
let currentInput = '';
let sessionStartTime;

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

function printInstant(text, element, className = 'ai-text') {
    const span = document.createElement('span');
    span.className = className;
    span.textContent = text;
    element.appendChild(span);
    element.appendChild(document.createElement('br'));
    output.scrollTop = output.scrollHeight;
}

async function executeCommand(command) {
    const lowerCommand = command.toLowerCase();

    if (lowerCommand === 'exit' || lowerCommand === 'quit') {
        await printSlow("AI: It was a pleasure interacting with you. Goodbye!", output);
        await new Promise(resolve => setTimeout(resolve, 1000));
        output.innerHTML = '';
        document.getElementById('input-line').style.display = 'none';
        printInstant("AI: SYSTEM OFFLINE", output);
        return;
    } else if (lowerCommand === 'clear') {
        output.innerHTML = '';
        return;
    } else if (lowerCommand === 'reboot') {
        await printSlow("AI: Rebooting system...", output);
        await new Promise(resolve => setTimeout(resolve, 1000));
        location.reload();
        return;
    } else if (lowerCommand === 'help') {
        await printSlow("AI: Available Commands:", output);
        printInstant("  - help: Show this help message", output);
        printInstant("  - about: Information about this AI", output);
        printInstant("  - status: System status report", output);
        printInstant("  - uptime: Current session duration", output);
        printInstant("  - date: Current date and time", output);
        printInstant("  - time: Current system time", output);
        printInstant("  - echo [text]: Repeat the input text", output);
        printInstant("  - uname: System information", output);
        printInstant("  - socials: View social links", output);
        printInstant("  - history: View command history", output);
        printInstant("  - clear-history: Clear command history", output);
        printInstant("  - whoami: Current user identity", output);
        printInstant("  - clear: Clear the terminal screen", output);
        printInstant("  - reboot: Restart the AI system", output);
        printInstant("  - exit/quit: Terminate the session", output);
        return;
    } else if (lowerCommand === 'date') {
        await printSlow(`AI: Current date and time: ${new Date().toLocaleString()}`, output);
        return;
    } else if (lowerCommand === 'whoami') {
        await printSlow("AI: User identity: Guest", output);
        return;
    } else if (lowerCommand === 'about') {
        await printSlow("AI: AI Experience: A web-based retro terminal simulation.", output);
        return;
    } else if (lowerCommand === 'history') {
        if (history.length === 0) {
            await printSlow("AI: No command history available.", output);
        } else {
            await printSlow("AI: Command History:", output);
            for (let i = 0; i < history.length; i++) {
                printInstant(`  ${i + 1}: ${history[i]}`, output);
            }
        }
        return;
    } else if (lowerCommand === 'clear-history') {
        history = [];
        localStorage.removeItem('terminalHistory');
        await printSlow("AI: Command history has been cleared.", output);
        return;
    } else if (lowerCommand === 'uptime') {
        const uptime = Math.floor((Date.now() - sessionStartTime) / 1000);
        const minutes = Math.floor(uptime / 60);
        const seconds = uptime % 60;
        await printSlow(`AI: System Uptime: ${minutes}m ${seconds}s`, output);
        return;
    } else if (lowerCommand === 'status') {
        const cpuStatus = ["Optimal", "Normal", "Stable", "Efficient"][Math.floor(Math.random() * 4)];
        const memUsage = Math.floor(Math.random() * 30) + 20; // 20% - 50%
        await printSlow("AI: System Status Report:", output);
        printInstant(`  - CPU: ${cpuStatus}`, output);
        printInstant(`  - Memory: ${memUsage}% utilized`, output);
        printInstant("  - Connection: Secure", output);
        printInstant("  - AI Core: Synchronized", output);
        return;
    } else if (lowerCommand === 'time') {
        const time = new Date().toLocaleTimeString();
        await printSlow(`AI: Current system time: ${time}`, output);
        return;
    } else if (lowerCommand === 'uname') {
        await printSlow("AI: AI-OS 1.0.4-generic x86_64 WebKit", output);
        return;
    } else if (lowerCommand === 'socials') {
        await printSlow("AI: Connecting to social nodes...", output);
        printInstant("  - GitHub: https://github.com/example", output);
        printInstant("  - Twitter: https://twitter.com/example", output);
        return;
    } else if (lowerCommand.startsWith('echo ')) {
        const text = command.substring(5);
        await printSlow(`AI: ${text}`, output);
        return;
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    await printSlow(`AI: ${randomResponse}`, output);
}

async function handleInput(event) {
    if (event.key === 'Enter') {
        const text = userInput.value.trim();

        if (!text) {
            printInstant('> ', output, 'user-text');
            userInput.value = '';
            return;
        }

        if (history.length === 0 || history[history.length - 1] !== text) {
            history.push(text);
            localStorage.setItem('terminalHistory', JSON.stringify(history));
        }
        historyIndex = -1;

        userInput.value = '';
        userInput.disabled = true;

        printInstant(`> ${text}`, output, 'user-text');

        try {
            await executeCommand(text);
        } catch (error) {
            console.error('Error executing command:', error);
            await printSlow("AI: An error occurred while processing your request.", output);
        } finally {
            userInput.disabled = false;
            userInput.focus();
        }
    } else if (event.key === 'ArrowUp') {
        if (history.length > 0) {
            if (historyIndex === -1) {
                currentInput = userInput.value;
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
                userInput.value = currentInput;
            }
            event.preventDefault();
        }
    }
}

userInput.addEventListener('keydown', handleInput);

window.addEventListener('click', () => {
    if (window.getSelection().toString() === '') {
        userInput.focus();
    }
});

window.onload = async () => {
    sessionStartTime = Date.now();
    const savedHistory = localStorage.getItem('terminalHistory');
    if (savedHistory) {
        try {
            const parsed = JSON.parse(savedHistory);
            if (Array.isArray(parsed)) {
                history = parsed;
            } else {
                console.warn('History in localStorage is not an array, clearing it.');
                localStorage.removeItem('terminalHistory');
            }
        } catch (e) {
            console.error('Failed to parse history from localStorage:', e);
            localStorage.removeItem('terminalHistory');
        }
    }

    userInput.disabled = true;
    await printSlow("Initializing AI Experience...", output);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await printSlow("Welcome. I am an AI simulation designed to interact with you.", output);
    userInput.disabled = false;
    userInput.focus();
};
