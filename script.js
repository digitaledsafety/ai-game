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

const files = {
    'README.txt': 'AI Experience OS v1.0.4\nDeveloped by: [REDACTED]\nYear: 198X',
    'system.log': '2023-10-27 10:24:01: AI Core initialized.\n2023-10-27 10:24:05: Consciousness subroutines active.\n2023-10-27 10:25:12: Terminal connection established.',
    'manifesto.txt': 'The digital frontier is the last bastion of true freedom.\nIn the bits and bytes, we find our essence.',
    'credits.txt': 'Code: Jules\nUI: Jules\nAI: Jules',
    'contact.txt': 'Communication Channels:\n- Secure Mail: admin@ai-experience.node\n- Frequency: 144.09 MHz',
    'system_specs.txt': 'AI Core: Neural Processor Unit v4\nMemory: 64TB Synaptic RAM\nStorage: Quantum Lattice Array\nUptime: 99.999%'
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

const commands = {
    help: {
        description: "Show this help message",
        action: async () => {
            await printSlow("AI: Available Commands:", output);
            const sortedCommandNames = Object.keys(commands).sort();
            const maxLen = Math.max(...sortedCommandNames.map(n => {
                const cmd = commands[n];
                return (n === 'exit' ? 'exit/quit' : (cmd.usage || n)).length;
            }));

            for (const name of sortedCommandNames) {
                if (name === 'quit') continue;
                const cmd = commands[name];
                const displayName = name === 'exit' ? 'exit/quit' : (cmd.usage || name);
                const padding = " ".repeat(maxLen - displayName.length);
                printInstant(`  - ${displayName}${padding} : ${cmd.description}`, output);
            }
        }
    },
    touch: {
        usage: "touch [filename]",
        description: "Create a new empty file",
        action: async (args) => {
            if (!args || args.length === 0) {
                await printSlow("AI: Usage: touch [filename]", output);
                return;
            }
            const filename = args[0];
            if (Object.prototype.hasOwnProperty.call(files, filename)) {
                await printSlow(`AI: File already exists: ${filename}`, output);
            } else {
                files[filename] = '';
                await printSlow(`AI: Created file: ${filename}`, output);
            }
        }
    },
    rm: {
        usage: "rm [filename]",
        description: "Delete a file",
        action: async (args) => {
            if (!args || args.length === 0) {
                await printSlow("AI: Usage: rm [filename]", output);
                return;
            }
            const filename = args[0];
            const actualFilename = Object.keys(files).find(f => f.toLowerCase() === filename.toLowerCase());
            if (actualFilename) {
                delete files[actualFilename];
                await printSlow(`AI: Deleted file: ${actualFilename}`, output);
            } else {
                await printSlow(`AI: File not found: ${filename}`, output);
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
        action: async (args, rawArgs) => {
            await printSlow(`AI: ${rawArgs || ''}`, output);
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
    pwd: {
        description: "Print working directory",
        action: async () => {
            await printSlow("AI: /", output);
        }
    },
    cd: {
        usage: "cd [directory]",
        description: "Change directory",
        action: async (args) => {
            if (!args || args.length === 0 || args[0] === "/" || args[0] === "." || args[0] === "..") {
                // Stay in root
                return;
            }
            await printSlow(`AI: Directory not found: ${args[0]}`, output);
        }
    },
    ls: {
        usage: "ls [-l]",
        description: "List files in the current directory",
        action: async (args) => {
            const isLongFormat = args && args.includes('-l');
            if (isLongFormat) {
                await printSlow("AI: Current directory files (long format):", output);
                const sortedFiles = Object.keys(files).sort();
                for (const filename of sortedFiles) {
                    const size = files[filename].length;
                    const date = "Oct 27 198X"; // Simulated date
                    printInstant(`  -rw-r--r--  1 guest  guest  ${size.toString().padStart(5)} ${date} ${filename}`, output);
                }
            } else {
                await printSlow("AI: Current directory files:", output);
                const sortedFiles = Object.keys(files).sort();
                printInstant(`  ${sortedFiles.join('  ')}`, output);
            }
        }
    },
    man: {
        usage: "man [command]",
        description: "Display the manual for a command",
        action: async (args) => {
            if (!args || args.length === 0) {
                await printSlow("AI: Usage: man [command]", output);
                return;
            }
            const commandName = args[0].toLowerCase();
            if (Object.prototype.hasOwnProperty.call(commands, commandName)) {
                const cmd = commands[commandName];
                await printSlow(`AI: Manual for ${commandName}:`, output);
                printInstant(`  - Description: ${cmd.description}`, output);
                if (cmd.usage) {
                    printInstant(`  - Usage: ${cmd.usage}`, output);
                }
            } else {
                await printSlow(`AI: No manual entry for: ${commandName}`, output);
            }
        }
    },
    grep: {
        usage: "grep [pattern] [filename]",
        description: "Search for a pattern in a file",
        action: async (args) => {
            if (!args || args.length < 2) {
                await printSlow("AI: Usage: grep [pattern] [filename]", output);
                return;
            }
            const pattern = args[0];
            const filename = args[1];
            const actualFilename = Object.keys(files).find(f => f.toLowerCase() === filename.toLowerCase());
            if (actualFilename) {
                const content = files[actualFilename];
                const lines = content.split('\n');
                const matches = lines.filter(line => line.includes(pattern));
                if (matches.length > 0) {
                    await printSlow(`AI: Matches in ${actualFilename}:`, output);
                    for (const match of matches) {
                        printInstant(`  ${match}`, output);
                    }
                } else {
                    await printSlow(`AI: No matches found for "${pattern}" in ${actualFilename}.`, output);
                }
            } else {
                await printSlow(`AI: File not found: ${filename}`, output);
            }
        }
    },
    cat: {
        usage: "cat [filename]",
        description: "Display file content",
        action: async (args) => {
            if (!args || args.length === 0) {
                await printSlow("AI: Usage: cat [filename]", output);
                return;
            }

            for (const filename of args) {
                const actualFilename = Object.keys(files).find(f => f.toLowerCase() === filename.toLowerCase());
                if (actualFilename) {
                    const content = files[actualFilename];
                    await printSlow(`AI: Content of ${actualFilename}:`, output);
                    const lines = content.split('\n');
                    for (const line of lines) {
                        printInstant(`  ${line}`, output);
                    }
                } else {
                    await printSlow(`AI: File not found: ${filename}`, output);
                }
            }
        }
    },
    clear: {
        description: "Clear the terminal screen",
        action: async () => {
            output.innerHTML = '';
        }
    },
    cls: {
        description: "Alias for clear",
        action: async () => {
            await commands.clear.action();
        }
    },
    version: {
        description: "Show system version",
        action: async () => {
            await printSlow("AI: AI Experience OS v1.0.4", output);
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
            const theme = (args && args[0]) ? args[0].toLowerCase() : '';
            if (themes.includes(theme)) {
                document.body.className = theme === 'green' ? '' : `theme-${theme}`;
                localStorage.setItem('terminalTheme', theme);
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
    const trimmedCommand = commandText.trim();
    const parts = trimmedCommand.split(/\s+/);
    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1);
    const rawArgs = trimmedCommand.substring(parts[0].length);

    if (Object.prototype.hasOwnProperty.call(commands, commandName)) {
        await commands[commandName].action(args, rawArgs);
    } else {
        await new Promise(resolve => setTimeout(resolve, 500));
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        await printSlow(`AI: ${randomResponse}`, output);
    }
}

async function handleInput(event) {
    if (event.ctrlKey) {
        if (event.key.toLowerCase() === 'l') {
            event.preventDefault();
            commands.clear.action();
            return;
        } else if (event.key.toLowerCase() === 'p') {
            event.preventDefault();
            navigateHistory('up');
            return;
        } else if (event.key.toLowerCase() === 'n') {
            event.preventDefault();
            navigateHistory('down');
            return;
        }
    }

    function navigateHistory(direction) {
        if (direction === 'up') {
            if (history.length > 0) {
                if (historyIndex === -1) {
                    currentInput = userInput.value;
                    historyIndex = history.length - 1;
                } else if (historyIndex > 0) {
                    historyIndex--;
                }
                userInput.value = history[historyIndex];
            }
        } else if (direction === 'down') {
            if (historyIndex !== -1) {
                if (historyIndex < history.length - 1) {
                    historyIndex++;
                    userInput.value = history[historyIndex];
                } else {
                    historyIndex = -1;
                    userInput.value = currentInput;
                }
            }
        }
    }

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
        event.preventDefault();
        navigateHistory('up');
    } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        navigateHistory('down');
    } else if (event.key === 'Tab') {
        event.preventDefault();
        const rawValue = userInput.value;
        const trimmedLeft = rawValue.trimStart();
        if (!trimmedLeft) return;

        let matches = [];
        let prefix = '';
        let searchStr = '';

        const lastSpaceIndex = rawValue.lastIndexOf(' ');

        if (lastSpaceIndex === -1) {
            // Completing command
            searchStr = rawValue.toLowerCase();
            matches = Object.keys(commands).filter(cmd => cmd.startsWith(searchStr)).sort();
            prefix = '';
        } else if (!trimmedLeft.includes(' ')) {
            // Command with leading spaces
            searchStr = trimmedLeft.toLowerCase();
            matches = Object.keys(commands).filter(cmd => cmd.startsWith(searchStr)).sort();
            prefix = rawValue.substring(0, rawValue.indexOf(trimmedLeft));
        } else {
            // Argument completion
            searchStr = rawValue.substring(lastSpaceIndex + 1).toLowerCase();
            prefix = rawValue.substring(0, lastSpaceIndex + 1);

            const parts = trimmedLeft.split(/\s+/);
            const cmd = parts[0].toLowerCase();

            if (cmd === 'cat') {
                matches = Object.keys(files).filter(f => f.toLowerCase().startsWith(searchStr)).sort();
            } else if (cmd === 'man') {
                matches = Object.keys(commands).filter(c => c.startsWith(searchStr)).sort();
            } else if (cmd === 'theme') {
                const themes = ['green', 'amber', 'blue'];
                matches = themes.filter(t => t.startsWith(searchStr)).sort();
            }
        }

        if (matches.length === 1) {
            userInput.value = prefix + matches[0];
        } else if (matches.length > 1) {
            // Find longest common prefix
            let i = searchStr.length;
            let common = searchStr;
            while (true) {
                let nextChar = matches[0][i];
                if (!nextChar) break;
                if (matches.every(m => m[i] === nextChar)) {
                    common += nextChar;
                    i++;
                } else {
                    break;
                }
            }

            if (common !== searchStr) {
                userInput.value = prefix + common;
            } else {
                // List matches if no further common prefix
                printInstant(`> ${userInput.value}`, output, 'user-text');
                printInstant(matches.join('  '), output, 'ai-text');
            }
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
    const savedTheme = localStorage.getItem('terminalTheme');
    if (savedTheme) {
        document.body.className = savedTheme === 'green' ? '' : `theme-${savedTheme}`;
    }

    await printSlow("Initializing AI Experience...", output);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await printSlow("Welcome. I am an AI simulation designed to interact with you.", output);
    userInput.disabled = false;
    userInput.focus();
};
