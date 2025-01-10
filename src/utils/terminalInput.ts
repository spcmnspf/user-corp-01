import styles from '../styles/terminalTS.module.css';
import { data } from '../data/info';
import { nhost } from '../utils/nhost'; // Adjust the import path as needed



type CommandAction = (args?: string[], print?: (text: string, type?: string) => void) => void;

interface Command {
    command: string;
    desc: string;
    hidden: boolean;
    action: CommandAction;
}

// Update the commands to use the print function
const commands: Command[] = [
    {
        command: 'help',
        desc: 'Show this help message',
        hidden: false,
        action: (args, print) => {
            const helpText = commands
                .filter(cmd => !cmd.hidden)
                .map(cmd => `  ${cmd.command.padEnd(10)} - ${cmd.desc}`)
                .join('\n');
            print(`Available commands:\n${helpText}`);
        },
    },
    {
        command: 'clear',
        desc: 'Clear terminal',
        hidden: false,
        action: (args, print) => {
            const outputElement = document.querySelector(`.${styles.terminalOutput}`) as HTMLElement;
            if (outputElement) {
                // Preserve welcome messages
                const welcomeMessages = Array.from(outputElement.children).slice(0, 2);
                outputElement.innerHTML = '';
                welcomeMessages.forEach(message => outputElement.appendChild(message));
            }
            print('Terminal cleared.');
        },
    },
    {
        command: 'status',
        desc: 'Show system status',
        hidden: false,
        action: async (args, print) => {
            const status = await getStatus();
            print(status);
        },
    },
    {
        command: 'whoami',
        desc: 'Display current user',
        hidden: false,
        action: async (args, print) => {
            const userInfo = await getUserInfo();
            print(userInfo);
        },
    },
    {
        command: 'time',
        desc: 'Show current time',
        hidden: false,
        action: (args, print) => {
            print(getCurrentTime());
        },
    },
    {
        command: 'version',
        desc: 'Show system version',
        hidden: false,
        action: (args, print) => {
            print(getVersionInfo());
        },
    },
    {
        command: 'login',
        desc: 'Login to system',
        hidden: false,
        action: (args, print) => {
            print('Authenticating user...');
            setTimeout(() => {
                (window as any).openLoginModal(); // Trigger the login modal
            }, 1000);
        },
    },
    {
        command: 'terminate',
        desc: 'Terminate session',
        hidden: false,
        action: (args, print) => {
            terminateSession();
            print('Session terminated successfully.');
        },
    },
    {
        command: 'hack',
        desc: 'Access corporate systems',
        hidden: true,
        action: (args, print) => {
            hackSystem();
            print('Hacking system...');
        },
    },
    {
        command: 'extract',
        desc: 'Extract encrypted data',
        hidden: true,
        action: (args, print) => {
            extractData();
            print('Extracting data...');
        },
    },
];

// Update the executeCommand function to accept a print function
export function executeCommand(input: string, print: (text: string, type?: string) => void): void {
    const [cmd, ...args] = input.split(' ');
    const command = commands.find(c => c.command === cmd);
    if (command) {
        command.action(args, print);
    } else {
        print(`Command "${input}" not found.`);
    }
}




async function getStatus() {
    const isAuthenticated = nhost.auth.isAuthenticated();
    if (isAuthenticated) {
        return 'System status: User is authenticated with Google.';
    } else {
        return 'System status: User is not authenticated. Please log in using the "login" command.';
    }
}



async function getUserInfo() {
    return 'User: Not authenticated\nPlease use the "login" command to authenticate.';
}

function getCurrentTime() {
    return `Current system time: ${new Date().toLocaleString()}`;
}

function getVersionInfo() {
    return `SassyOS ${data.version}\n\n  S)ecure\n  A)uthentication\n  S)ystem\n  S)ynced\n  Y)esterday\n\nBuild: ${data.build}`;
}

function terminateSession() {
    console.log('Session terminated successfully.');
}

function hackSystem() {
    console.log('Hacking system...');
}

function extractData() {
    console.log('Extracting data...');
}
