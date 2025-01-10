import React, { useEffect, useRef } from 'react';
import styles from '../styles/terminalTS.module.css';
import { executeCommand, getCommands, useTerminateSession, Command } from './terminalInput';

const Terminal: React.FC<{ container: HTMLElement }> = ({ container }) => {
    const history = useRef<string[]>([]);
    const historyIndex = useRef<number>(-1);
    const outputElement = useRef<HTMLElement | null>(null);
    const inputElement = useRef<HTMLInputElement | null>(null);
    const commands = useRef<Command[]>([]);
    const terminateSession = useTerminateSession();

    useEffect(() => {
        commands.current = getCommands(terminateSession);
        setupTerminal();
    }, [terminateSession]);

    const setupTerminal = () => {
        container.innerHTML = `
            <div class="${styles.terminalBody} ${styles.local}">
                <div class="${styles.terminalOutput}"></div>
                <div class="${styles.terminalInputLine}">
                    <span class="${styles.prompt}">&gt;</span>
                    <input type="text" class="${styles.terminalInput}" spellcheck="false" autocomplete="off">
                </div>
            </div>
        `;

        outputElement.current = container.querySelector(`.${styles.terminalOutput}`) as HTMLElement;
        inputElement.current = container.querySelector(`.${styles.terminalInput}`) as HTMLInputElement;

        setupEventListeners();
        printWelcome();
    };

    const printWelcome = () => {
        print('Terminal initialized...', styles.centered);
        print('Type "help" for available commands.', styles.centered);
    };

    const print = (text: string, type: string = styles.output) => {
        if (type === 'clear') {
            // Clear the terminal output
            if (outputElement.current) {
                outputElement.current.innerHTML = ''; // Clear all content
            }
            return;
        }

        // Normal output
        const lines = text.split('\n');
        lines.forEach(lineText => {
            const line = document.createElement('div');
            line.className = `${styles.terminalLine} ${type}`;
            line.textContent = lineText;
            outputElement.current?.appendChild(line);
            container.scrollTop = container.scrollHeight;
            outputElement.current!.scrollTop = outputElement.current!.scrollHeight;
        });

        requestAnimationFrame(() => {
            container.scrollTop = container.scrollHeight;
            outputElement.current!.scrollTop = outputElement.current!.scrollHeight;
        });
    };

    const setupEventListeners = () => {
        inputElement.current?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = inputElement.current?.value?.trim();
                if (command) {
                    executeCommandHandler(command);
                    history.current.push(command);
                    historyIndex.current = history.current.length;
                    inputElement.current.value = '';
                }
            }
        });

        inputElement.current?.focus();
        container.addEventListener('click', () => inputElement.current?.focus());
    };

    const executeCommandHandler = (command: string) => {
        print(`> ${command}`, styles.command);

        executeCommand(
            command,
            (text: string, type?: string) => {
                print(text, type || styles.output);
            },
            commands.current
        );
    };

    return null; // Since this component doesn't render anything directly
};

export default Terminal;