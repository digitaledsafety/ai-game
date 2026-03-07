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

const commands = {
    help: {
        description: 'Show this help message',
        execute: async () => {
            await printSlow("AI: Available Commands:", output);
            for (const cmd in commands) {
                if (Object.prototype.hasOwnProperty.call(commands, cmd)) {
                    printInstant(`  - ${cmd}: ${commands[cmd].description}`, output);
                }
            }
        }
    },
    about: {
        description: 'Information about this AI',
        execute: async () => {
            await printSlow("AI: AI Experience: A web-based retro terminal simulation.", output);
        }
    },
    status: {
        description: 'System status report',
        execute: async () => {
            const cpuStatus = ["Optimal", "Normal", "Stable", "Efficient"][Math.floor(Math.random() * 4)];
            const memUsage = Math.floor(Math.random() * 30) + 20; // 20% - 50%
            await printSlow("AI: System Status Report:", output);
            printInstant(`  - CPU: ${cpuStatus}`, output);
            printInstant(`  - Memory: ${memUsage}% utilized`, output);
            printInstant("  - Connection: Secure", output);
            printInstant("  - AI Core: Synchronized", output);
        }
    },
    uptime: {
        description: 'Current session duration',
        execute: async () => {
            const uptime = Math.floor((Date.now() - sessionStartTime) / 1000);
            const minutes = Math.floor(uptime / 60);
            const seconds = uptime % 60;
            await printSlow(`AI: System Uptime: ${minutes}m ${seconds}s`, output);
        }
    },
    date: {
        description: 'Current date and time',
        execute: async () => {
            await printSlow(`AI: Current date and time: ${new Date().toLocaleString()}`, output);
        }
    },
    time: {
        description: 'Current system time',
        execute: async () => {
            const time = new Date().toLocaleTimeString();
            await printSlow(`AI: Current system time: ${time}`, output);
        }
    },
    echo: {
        description: 'Repeat the input text',
        execute: async (args, rawCommand) => {
            const trimmed = rawCommand.trim();
            const spaceIndex = trimmed.indexOf(' ');
            const text = spaceIndex === -1 ? '' : trimmed.substring(spaceIndex + 1);
            await printSlow(`AI: ${text}`, output);
        }
    },
    uname: {
        description: 'System information',
        execute: async () => {
            await printSlow("AI: AI-OS 1.0.4-generic x86_64 WebKit", output);
        }
    },
    socials: {
        description: 'View social links',
        execute: async () => {
            await printSlow("AI: Connecting to social nodes...", output);
            printInstant("  - GitHub: https://github.com/example", output);
            printInstant("  - Twitter: https://twitter.com/example", output);
        }
    },
    history: {
        description: 'View command history',
        execute: async () => {
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
        description: 'Clear command history',
        execute: async () => {
            history = [];
            localStorage.removeItem('terminalHistory');
            await printSlow("AI: Command history has been cleared.", output);
        }
    },
    theme: {
        description: 'Change the terminal theme (classic, amber, blue)',
        execute: async (args) => {
            const theme = args[0];
            if (!theme) {
                await printSlow("AI: Current themes: classic, amber, blue. Usage: theme [name]", output);
                return;
            }

            const validThemes = ['classic', 'amber', 'blue'];
            if (validThemes.includes(theme)) {
                document.body.className = `theme-${theme}`;
                await printSlow(`AI: Theme changed to ${theme}.`, output);
            } else {
                await printSlow(`AI: Unknown theme: ${theme}. Available: ${validThemes.join(', ')}`, output);
            }
        }
    },
    whoami: {
        description: 'Current user identity',
        execute: async () => {
            await printSlow("AI: User identity: Guest", output);
        }
    },
    clear: {
        description: 'Clear the terminal screen',
        execute: async () => {
            output.innerHTML = '';
        }
    },
    reboot: {
        description: 'Restart the AI system',
        execute: async () => {
            await printSlow("AI: Rebooting system...", output);
            await new Promise(resolve => setTimeout(resolve, 1000));
            location.reload();
        }
    },
    exit: {
        description: 'Terminate the session',
        execute: async () => {
            await printSlow("AI: It was a pleasure interacting with you. Goodbye!", output);
            await new Promise(resolve => setTimeout(resolve, 1000));
            output.innerHTML = '';
            document.getElementById('input-line').style.display = 'none';
            printInstant("AI: SYSTEM OFFLINE", output);
        }
    },
    quit: {
        description: 'Terminate the session',
        execute: async () => {
            await commands.exit.execute();
        }
    }
};

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
    const parts = command.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (Object.prototype.hasOwnProperty.call(commands, cmd)) {
        await commands[cmd].execute(args, command);
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
            if (history.length > 50) {
                history.shift();
            }
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
        handleTabCompletion();
    }
}

function handleTabCompletion() {
    const value = userInput.value.trim().toLowerCase();
    if (!value) return;

    const matches = Object.keys(commands)
        .filter(cmd => cmd.startsWith(value))
        .sort();

    if (matches.length === 1) {
        userInput.value = matches[0];
    } else if (matches.length > 1) {
        const lcp = getLongestCommonPrefix(matches);
        if (lcp.length > value.length) {
            userInput.value = lcp;
        } else {
            // If we can't complete further, show matches
            printInstant(`> ${userInput.value}`, output, 'user-text');
            printInstant(`AI: Matches: ${matches.join(', ')}`, output);
        }
    }
}

function getLongestCommonPrefix(strs) {
    if (!strs.length) return '';
    let prefix = strs[0];
    for (let i = 1; i < strs.length; i++) {
        while (strs[i].indexOf(prefix) !== 0) {
            prefix = prefix.substring(0, prefix.length - 1);
            if (!prefix) return '';
        }
    }
    return prefix;
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
