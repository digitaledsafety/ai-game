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

const commands = {
    help: {
        description: "Show this help message",
        action: async () => {
            await printSlow("AI: Available Commands:", output);
            for (const [name, cmd] of Object.entries(commands)) {
                if (name === 'quit') continue;
                const displayName = name === 'exit' ? 'exit/quit' : (cmd.usage || name);
                printInstant(`  - ${displayName}: ${cmd.description}`, output);
            }
        }
    },
    about: {
        description: "Information about this AI",
        action: async () => {
            await printSlow("AI: AI Experience: A web-based retro terminal simulation.", output);
        }
    },
    status: {
        description: "System status report",
        action: async () => {
            const cpuStatus = ["Optimal", "Normal", "Stable", "Efficient"][Math.floor(Math.random() * 4)];
            const memUsage = Math.floor(Math.random() * 30) + 20;
            await printSlow("AI: System Status Report:", output);
            printInstant(`  - CPU: ${cpuStatus}`, output);
            printInstant(`  - Memory: ${memUsage}% utilized`, output);
            printInstant("  - Connection: Secure", output);
            printInstant("  - AI Core: Synchronized", output);
        }
    },
    uptime: {
        description: "Current session duration",
        action: async () => {
            const uptime = Math.floor((Date.now() - sessionStartTime) / 1000);
            const minutes = Math.floor(uptime / 60);
            const seconds = uptime % 60;
            await printSlow(`AI: System Uptime: ${minutes}m ${seconds}s`, output);
        }
    },
    date: {
        description: "Current date and time",
        action: async () => {
            await printSlow(`AI: Current date and time: ${new Date().toLocaleString()}`, output);
        }
    },
    time: {
        description: "Current system time",
        action: async () => {
            const time = new Date().toLocaleTimeString();
            await printSlow(`AI: Current system time: ${time}`, output);
        }
    },
    echo: {
        usage: "echo [text]",
        description: "Repeat the input text",
        action: async (args) => {
            if (!args) {
                await printSlow("AI: ", output);
            } else {
                await printSlow(`AI: ${args}`, output);
            }
        }
    },
    uname: {
        description: "System information",
        action: async () => {
            await printSlow("AI: AI-OS 1.0.4-generic x86_64 WebKit", output);
        }
    },
    socials: {
        description: "View social links",
        action: async () => {
            await printSlow("AI: Connecting to social nodes...", output);
            printInstant("  - GitHub: https://github.com/example", output);
            printInstant("  - Twitter: https://twitter.com/example", output);
        }
    },
    history: {
        description: "View command history",
        action: async () => {
            if (history.length === 0) {
                await printSlow("AI: No command history available.", output);
            } else {
                await printSlow("AI: Command History:", output);
                for (let i = 0; i < history.length; i++) {
                    printInstant(`  ${i + 1}: ${history[i]}`, output);
                }
            }
        }
    },
    'clear-history': {
        description: "Clear command history",
        action: async () => {
            history = [];
            localStorage.removeItem('terminalHistory');
            await printSlow("AI: Command history has been cleared.", output);
        }
    },
    whoami: {
        description: "Current user identity",
        action: async () => {
            await printSlow("AI: User identity: Guest", output);
        }
    },
    clear: {
        description: "Clear the terminal screen",
        action: async () => {
            output.innerHTML = '';
        }
    },
    reboot: {
        description: "Restart the AI system",
        action: async () => {
            await printSlow("AI: Rebooting system...", output);
            await new Promise(resolve => setTimeout(resolve, 1000));
            location.reload();
        }
    },
    theme: {
        usage: "theme [color]",
        description: "Change terminal theme (green, amber, blue)",
        action: async (args) => {
            const themes = ['green', 'amber', 'blue'];
            const theme = args ? args.toLowerCase() : '';
            if (themes.includes(theme)) {
                document.body.className = theme === 'green' ? '' : `theme-${theme}`;
                await printSlow(`AI: Theme changed to ${theme}.`, output);
            } else {
                await printSlow("AI: Available themes: green, amber, blue.", output);
            }
        }
    },
    exit: {
        description: "Terminate the session",
        action: async () => {
            await printSlow("AI: It was a pleasure interacting with you. Goodbye!", output);
            await new Promise(resolve => setTimeout(resolve, 1000));
            output.innerHTML = '';
            document.getElementById('input-line').style.display = 'none';
            printInstant("AI: SYSTEM OFFLINE", output);
        }
    },
    quit: {
        description: "Terminate the session",
        action: async () => {
            await commands.exit.action();
        }
    }
};

async function executeCommand(commandText) {
    const parts = commandText.trim().split(/\s+/);
    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    if (Object.prototype.hasOwnProperty.call(commands, commandName)) {
        await commands[commandName].action(args);
    } else {
        await new Promise(resolve => setTimeout(resolve, 500));
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        await printSlow(`AI: ${randomResponse}`, output);
    }
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
            if (history.length > 50) history.shift();
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
    } else if (event.key === 'Tab') {
        event.preventDefault();
        const text = userInput.value.toLowerCase();
        if (!text || text.includes(' ')) return;

        const matches = Object.keys(commands).filter(cmd => cmd.startsWith(text));
        if (matches.length === 1) {
            userInput.value = matches[0];
        } else if (matches.length > 1) {
            // Find longest common prefix
            let i = text.length;
            let prefix = text;
            while (true) {
                let nextChar = matches[0][i];
                if (!nextChar) break;
                if (matches.every(m => m[i] === nextChar)) {
                    prefix += nextChar;
                    i++;
                } else {
                    break;
                }
            }
            userInput.value = prefix;
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
