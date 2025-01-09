type CommandAction = (args?: string[]) => void;

interface Command {
    command: string;
    desc: string;
    hidden: boolean;
    action: CommandAction;
}

const commands: Command[] = [
    {
        command: 'help',
        desc: 'Show this help message',
        hidden: false,
        action: () => {
            const helpText = commands
                .filter(cmd => !cmd.hidden)
                .map(cmd => `  ${cmd.command.padEnd(10)} - ${cmd.desc}`)
                .join('\n');
            console.log(`Available commands:\n${helpText}`);
        },
    },
    {
        command: 'clear',
        desc: 'Clear terminal',
        hidden: false,
        action: () => {
            console.clear();
        },
    },
    {
        command: 'status',
        desc: 'Show system status',
        hidden: false,
        action: async () => {
            const status = await getStatus();
            console.log(status);
        },
    },
    {
        command: 'whoami',
        desc: 'Display current user',
        hidden: false,
        action: async () => {
            const userInfo = await getUserInfo();
            console.log(userInfo);
        },
    },
    {
        command: 'time',
        desc: 'Show current time',
        hidden: false,
        action: () => {
            console.log(getCurrentTime());
        },
    },
    {
        command: 'version',
        desc: 'Show system version',
        hidden: false,
        action: () => {
            console.log(getVersionInfo());
        },
    },
    {
        command: 'login',
        desc: 'Login to system',
        hidden: false,
        action: () => {
            // openModal();
        },
    },
    {
        command: 'terminate',
        desc: 'Terminate session',
        hidden: false,
        action: () => {
            terminateSession();
        },
    },
    {
        command: 'hack',
        desc: 'Access corporate systems',
        hidden: true,
        action: () => {
            hackSystem();
        },
    },
    {
        command: 'extract',
        desc: 'Extract encrypted data',
        hidden: true,
        action: () => {
            extractData();
        },
    },
];

export function executeCommand(input: string): void {
    const [cmd, ...args] = input.split(' ');
    const command = commands.find(c => c.command === cmd);
    if (command) {
        command.action(args);
    } else {
        console.log(`Command "${input}" not found.`);
    }
}

// Placeholder functions for command actions
async function getStatus() {
    return 'System status: All systems operational.';
}

async function getUserInfo() {
    return 'User: Not authenticated\nPlease use the "login" command to authenticate.';
}

function getCurrentTime() {
    return `Current system time: ${new Date().toLocaleString()}`;
}

function getVersionInfo() {
    return 'System version: 1.0.0\nBuild: 20231001';
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