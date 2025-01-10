import { useState } from 'react';
import { useSignOut } from '@nhost/react';
import { data } from '../data/info';
import { nhost } from '../utils/nhost';

// Define types
type CommandAction = (args?: string[], print?: (text: string, type?: string) => void) => void;

interface Command {
    command: string;
    desc: string;
    hidden: boolean;
    action: CommandAction;
}

// Custom hook for terminateSession
const useTerminateSession = () => {
    const { signOut } = useSignOut();

    const terminateSession = async (print: (text: string, type?: string) => void) => {
        print('Initiating session termination...');
        setTimeout(() => {
            console.log('Clearing authentication tokens...');
        }, 1000);
        await signOut();
        setTimeout(() => {
            console.log('Session terminated successfully.');
            print('Session terminated successfully.');
        }, 2000);
    };

    return terminateSession;
};

// Define the commands array
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
            print('Terminal cleared.', 'clear');
        },
    },
    {
        command: 'status',
        desc: 'Show system status',
        hidden: false,
        action: async (args, print) => {
            const status = await getStatus(commands);
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
                // Use a state or context to open the login modal
                (window as any).openLoginModal(); // Replace with a React-friendly approach
            }, 1000);
        },
    },
    {
        command: 'terminate',
        desc: 'Terminate session',
        hidden: false,
        action: async (args, print) => {
            const terminateSession = useTerminateSession(); // Use the custom hook
            await terminateSession(print);
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

// Define executeCommand as a standalone function
export function executeCommand(
    input: string,
    print: (text: string, type?: string) => void,
    commands: Command[]
): void {
    const [cmd, ...args] = input.split(' ');
    const command = commands.find(c => c.command === cmd);
    if (command) {
        command.action(args, print);
    } else {
        print(`Command "${input}" not found.`);
    }
}

// Helper functions
async function getStatus(commands: Command[]) {
    const isAuthenticated = nhost.auth.isAuthenticated();
    if (isAuthenticated) {
        const availableCommands = commands
            .filter(cmd => cmd.hidden)
            .map(cmd => cmd.command)
            .join(', ');
        return 'System status: All systems operational.\nAvailable secure commands: ' + availableCommands;
    } else {
        return 'System status: User is not authenticated. Please log in using the "login" command.';
    }
}

async function getUserInfo() {
    try {
        const user = nhost.auth.getUser();
        if (user) {
            return `User: ${user.displayName}\nPlease use the "terminate" command to log out.`;
        }
        return 'User: Not authenticated\nPlease use the "login" command to authenticate.';
    } catch (error) {
        console.error('Error getting user info:', error);
        return 'Error: Could not fetch user information.';
    }
}

function getCurrentTime() {
    return `Current system time: ${new Date().toLocaleString()}`;
}

function getVersionInfo() {
    return `SassyOS ${data.version}\n\n  S)ecure\n  A)uthentication\n  S)ystem\n  S)ynced\n  Y)esterday\n\nBuild: ${data.build}`;
}

function hackSystem() {
    console.log('Hacking system...');
}

function extractData() {
    console.log('Extracting data...');
}

// Define the useTerminal hook
const useTerminal = () => {
    const [output, setOutput] = useState<string[]>([]);
    const terminateSession = useTerminateSession(); // Use the custom hook

    const print = (text: string, type?: string) => {
        if (type === 'clear') {
            setOutput([]);
        } else {
            setOutput(prev => [...prev, text]);
        }
    };

    const handleCommand = (input: string) => {
        executeCommand(input, print, commands);
    };

    return { output, handleCommand };
};

// Export everything
export { useTerminal, commands };