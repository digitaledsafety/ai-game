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
    'README.txt': 'Game Experience OS v1.0.4\nDeveloped by: [REDACTED]\nYear: 198X',
    'system.log': '2023-10-27 10:24:01: AI Core initialized.\n2023-10-27 10:24:05: Consciousness subroutines active.\n2023-10-27 10:25:12: Terminal connection established.',
    'manifesto.txt': 'The digital frontier is the last bastion of true freedom.\nIn the bits and bytes, we find our essence.',
    'credits.txt': 'Code: Jules\nUI: Jules\nGame: Jules',
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
            await printSlow("Game: Available Commands:", output);
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
    mv: {
        usage: "mv [source] [destination]",
        description: "Move or rename a file",
        action: async (args) => {
            if (!args || args.length < 2) {
                await printSlow("Game: Usage: mv [source] [destination]", output);
                return;
            }
            const source = args[0];
            const dest = args[1];

            if (source.toLowerCase() === dest.toLowerCase()) {
                await printSlow(`Game: Source and destination are the same: ${source}`, output);
                return;
            }

            const actualSource = Object.keys(files).find(f => f.toLowerCase() === source.toLowerCase());
            if (actualSource) {
                files[dest] = files[actualSource];
                delete files[actualSource];
                await printSlow(`Game: Moved ${actualSource} to ${dest}`, output);
            } else {
                await printSlow(`Game: Source file not found: ${source}`, output);
            }
        }
    },
    touch: {
        usage: "touch [filename]...",
        description: "Create new empty file(s)",
        action: async (args) => {
            if (!args || args.length === 0) {
                await printSlow("Game: Usage: touch [filename]...", output);
                return;
            }
            for (const filename of args) {
                if (Object.prototype.hasOwnProperty.call(files, filename)) {
                    await printSlow(`Game: File already exists: ${filename}`, output);
                } else {
                    files[filename] = '';
                    await printSlow(`Game: Created file: ${filename}`, output);
                }
            }
        }
    },
    rm: {
        usage: "rm [filename]...",
        description: "Delete file(s)",
        action: async (args) => {
            if (!args || args.length === 0) {
                await printSlow("Game: Usage: rm [filename]...", output);
                return;
            }
            for (const filename of args) {
                const actualFilename = Object.keys(files).find(f => f.toLowerCase() === filename.toLowerCase());
                if (actualFilename) {
                    delete files[actualFilename];
                    await printSlow(`Game: Deleted file: ${actualFilename}`, output);
                } else {
                    await printSlow(`Game: File not found: ${filename}`, output);
                }
            }
        }
    },
    about: {
        description: "Information about this AI",
        action: async () => {
            await printSlow("Game: Game Experience: A web-based retro terminal simulation.", output);
        }
    },
    status: {
        description: "System status report",
        action: async () => {
            const cpuStatus = ["Optimal", "Normal", "Stable", "Efficient"][Math.floor(Math.random() * 4)];
            const memUsage = Math.floor(Math.random() * 30) + 20;
            await printSlow("Game: System Status Report:", output);
            printInstant(`  - CPU: ${cpuStatus}`, output);
            printInstant(`  - Memory: ${memUsage}% utilized`, output);
            printInstant("  - Connection: Secure", output);
            printInstant("  - AI Core: Synchronized", output);
        }
    },
    sudo: {
        description: "Execute command as superuser",
        action: async () => {
            await printSlow("Game: Permission denied: User 'Guest' is not in the sudoers file. This incident will be reported.", output);
        }
    },
    uptime: {
        description: "Current session duration",
        action: async () => {
            const uptime = Math.floor((Date.now() - sessionStartTime) / 1000);
            const minutes = Math.floor(uptime / 60);
            const seconds = uptime % 60;
            await printSlow(`Game: System Uptime: ${minutes}m ${seconds}s`, output);
        }
    },
    date: {
        description: "Current date and time",
        action: async () => {
            await printSlow(`Game: Current date and time: ${new Date().toLocaleString()}`, output);
        }
    },
    time: {
        description: "Current system time",
        action: async () => {
            const time = new Date().toLocaleTimeString();
            await printSlow(`Game: Current system time: ${time}`, output);
        }
    },
    echo: {
        usage: "echo [text]",
        description: "Repeat the input text",
        action: async (args, rawArgs) => {
            await printSlow(`Game: ${rawArgs || ''}`, output);
        }
    },
    uname: {
        description: "System information",
        action: async () => {
            await printSlow("Game: Game-OS 1.0.4-generic x86_64 WebKit", output);
        }
    },
    write: {
        usage: "write [filename] [content]",
        description: "Write content to a file",
        action: async (args, rawArgs) => {
            if (!args || args.length < 2) {
                await printSlow("Game: Usage: write [filename] [content]", output);
                return;
            }
            const filename = args[0];
            // rawArgs is content after "write " (with one space potentially stripped)
            // We need to find where the filename ends in rawArgs
            const filenameMatch = rawArgs.match(new RegExp('^\\s*' + filename.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')));
            const content = filenameMatch ? rawArgs.substring(filenameMatch[0].length).trimStart() : '';
            files[filename] = content;
            await printSlow(`Game: Written to ${filename}`, output);
        }
    },
    socials: {
        description: "View social links",
        action: async () => {
            await printSlow("Game: Connecting to social nodes...", output);
            printInstant("  - GitHub: https://github.com/example", output);
            printInstant("  - Twitter: https://twitter.com/example", output);
        }
    },
    history: {
        description: "View command history",
        action: async () => {
            if (history.length === 0) {
                await printSlow("Game: No command history available.", output);
            } else {
                await printSlow("Game: Command History:", output);
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
            historyIndex = -1;
            localStorage.removeItem('terminalHistory');
            await printSlow("Game: Command history has been cleared.", output);
        }
    },
    whoami: {
        description: "Current user identity",
        action: async () => {
            await printSlow("Game: User identity: Guest", output);
        }
    },
    pwd: {
        description: "Print working directory",
        action: async () => {
            await printSlow("Game: /", output);
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
            await printSlow(`Game: Directory not found: ${args[0]}`, output);
        }
    },
    cp: {
        usage: "cp [source] [destination]",
        description: "Copy a file",
        action: async (args) => {
            if (!args || args.length < 2) {
                await printSlow("Game: Usage: cp [source] [destination]", output);
                return;
            }
            const source = args[0];
            const dest = args[1];

            if (source.toLowerCase() === dest.toLowerCase()) {
                await printSlow(`Game: Source and destination are the same: ${source}`, output);
                return;
            }

            const actualSource = Object.keys(files).find(f => f.toLowerCase() === source.toLowerCase());
            if (actualSource) {
                files[dest] = files[actualSource];
                await printSlow(`Game: Copied ${actualSource} to ${dest}`, output);
            } else {
                await printSlow(`Game: Source file not found: ${source}`, output);
            }
        }
    },
    ls: {
        usage: "ls [-l]",
        description: "List files in the current directory",
        action: async (args) => {
            const isLongFormat = args && args.includes('-l');
            if (isLongFormat) {
                await printSlow("Game: Current directory files (long format):", output);
                const sortedFiles = Object.keys(files).sort();
                for (const filename of sortedFiles) {
                    const size = files[filename].length;
                    const date = "Oct 27 198X"; // Simulated date
                    printInstant(`  -rw-r--r--  1 guest  guest  ${size.toString().padStart(5)} ${date} ${filename}`, output);
                }
            } else {
                await printSlow("Game: Current directory files:", output);
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
                await printSlow("Game: Usage: man [command]", output);
                return;
            }
            const commandName = args[0].toLowerCase();
            if (Object.prototype.hasOwnProperty.call(commands, commandName)) {
                const cmd = commands[commandName];
                await printSlow(`Game: Manual for ${commandName}:`, output);
                printInstant(`  - Description: ${cmd.description}`, output);
                if (cmd.usage) {
                    printInstant(`  - Usage: ${cmd.usage}`, output);
                }
            } else {
                await printSlow(`Game: No manual entry for: ${commandName}`, output);
            }
        }
    },
    grep: {
        usage: "grep [pattern] [filename]",
        description: "Search for a pattern in a file",
        action: async (args) => {
            if (!args || args.length < 2) {
                await printSlow("Game: Usage: grep [pattern] [filename]", output);
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
                    await printSlow(`Game: Matches in ${actualFilename}:`, output);
                    for (const match of matches) {
                        printInstant(`  ${match}`, output);
                    }
                } else {
                    await printSlow(`Game: No matches found for "${pattern}" in ${actualFilename}.`, output);
                }
            } else {
                await printSlow(`Game: File not found: ${filename}`, output);
            }
        }
    },
    cat: {
        usage: "cat [filename]",
        description: "Display file content",
        action: async (args) => {
            if (!args || args.length === 0) {
                await printSlow("Game: Usage: cat [filename]", output);
                return;
            }

            for (const filename of args) {
                const actualFilename = Object.keys(files).find(f => f.toLowerCase() === filename.toLowerCase());
                if (actualFilename) {
                    const content = files[actualFilename];
                    await printSlow(`Game: Content of ${actualFilename}:`, output);
                    const lines = content.split('\n');
                    for (const line of lines) {
                        printInstant(`  ${line}`, output);
                    }
                } else {
                    await printSlow(`Game: File not found: ${filename}`, output);
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
            await printSlow("Game: Game Experience OS v1.0.4", output);
        }
    },
    reboot: {
        description: "Restart the AI system",
        action: async () => {
            await printSlow("Game: Rebooting system...", output);
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
                await printSlow(`Game: Theme changed to ${theme}.`, output);
            } else {
                await printSlow("Game: Available themes: green, amber, blue.", output);
            }
        }
    },
    exit: {
        description: "Terminate the session",
        action: async () => {
            await printSlow("Game: It was a pleasure interacting with you. Goodbye!", output);
            await new Promise(resolve => setTimeout(resolve, 1000));
            output.innerHTML = '';
            document.getElementById('input-line').style.display = 'none';
            printInstant("Game: SYSTEM OFFLINE", output);
        }
    },

    game: {
        description: "Launch a basic 2D graphics game",
        action: async () => {
            const canvas = document.getElementById("game-canvas");
            const outputArea = document.getElementById("output");
            const inputLine = document.getElementById("input-line");

            await printSlow("Game: Initializing graphics sub-system...", output);
            await new Promise(resolve => setTimeout(resolve, 1000));

            outputArea.style.display = "none";
            inputLine.style.display = "none";
            canvas.style.display = "block";

            const ctx = canvas.getContext("2d");
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;

            let x = canvas.width / 2;
            let y = canvas.height / 2;
            const size = 20;
            let dx = 0;
            let dy = 0;
            const speed = 3;

            let running = true;

            const keys = {};
            const handleKeyDown = (e) => {
                keys[e.key] = true;
                if (e.key === "Escape" || e.key === "q") {
                    running = false;
                }
            };
            const handleKeyUp = (e) => {
                keys[e.key] = false;
            };

            window.addEventListener("keydown", handleKeyDown);
            window.addEventListener("keyup", handleKeyUp);

            function gameLoop() {
                if (!running) {
                    window.removeEventListener("keydown", handleKeyDown);
                    window.removeEventListener("keyup", handleKeyUp);
                    canvas.style.display = "none";
                    outputArea.style.display = "block";
                    inputLine.style.display = "flex";
                    printInstant("Game: Graphics session terminated.", output);
                    userInput.focus();
                    return;
                }

                if (keys["ArrowUp"] || keys["w"]) dy = -speed;
                else if (keys["ArrowDown"] || keys["s"]) dy = speed;
                else dy = 0;

                if (keys["ArrowLeft"] || keys["a"]) dx = -speed;
                else if (keys["ArrowRight"] || keys["d"]) dx = speed;
                else dx = 0;

                x += dx;
                y += dy;

                // Boundaries
                if (x < 0) x = 0;
                if (x + size > canvas.width) x = canvas.width - size;
                if (y < 0) y = 0;
                if (y + size > canvas.height) y = canvas.height - size;

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Draw player
                const primaryColor = getComputedStyle(document.body).getPropertyValue("--primary-color").trim() || "#00ff41";
                ctx.fillStyle = primaryColor;
                ctx.shadowBlur = 10;
                ctx.shadowColor = primaryColor;
                ctx.fillRect(x, y, size, size);

                // Draw instructions
                ctx.shadowBlur = 0;
                ctx.font = "16px Courier New";
                ctx.fillText("WASD/Arrows to move, Q/Esc to exit", 10, 25);

                requestAnimationFrame(gameLoop);
            }

            gameLoop();
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
    // Find where the command name ends in the trimmed command to extract raw arguments
    const commandMatch = commandText.match(/^\s*(\S+)/);
    const rawArgs = commandMatch ? commandText.substring(commandMatch[0].length).replace(/^ /, '') : '';

    if (Object.prototype.hasOwnProperty.call(commands, commandName)) {
        await commands[commandName].action(args, rawArgs);
    } else {
        await new Promise(resolve => setTimeout(resolve, 500));
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        await printSlow(`Game: ${randomResponse}`, output);
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
            await printSlow("Game: An error occurred while processing your request.", output);
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

            if (['cat', 'rm', 'grep', 'touch', 'cp', 'mv', 'write'].includes(cmd)) {
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

    await printSlow("Initializing Game Experience...", output);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await printSlow("Welcome. I am a game simulation designed to interact with you.", output);
    userInput.disabled = false;
    userInput.focus();
};
