import styles from '../styles/terminalTS.module.css';
import { executeCommand } from './terminalInput';

export class Terminal {
    container: HTMLElement;
    history: string[];
    historyIndex: number;
    outputElement: HTMLElement;
    inputElement: HTMLInputElement;

    constructor(container: HTMLElement) {
        this.container = container;
        this.history = [];
        this.historyIndex = -1;
        this.setupTerminal();
    }

    setupTerminal() {
        this.container.innerHTML = `
            <div class="${styles.terminalBody} ${styles.local}">
                <div class="${styles.terminalOutput}"></div>
                <div class="${styles.terminalInputLine}">
                    <span class="${styles.prompt}">&gt;</span>
                    <input type="text" class="${styles.terminalInput}" spellcheck="false" autocomplete="off">
                </div>
            </div>
        `;
    
        this.outputElement = this.container.querySelector(`.${styles.terminalOutput}`) as HTMLElement;
        this.inputElement = this.container.querySelector(`.${styles.terminalInput}`) as HTMLInputElement;
    
        console.log('Output Element:', this.outputElement); // Debugging line
        console.log('Input Element:', this.inputElement); // Debugging line
    
        if (!this.inputElement) {
            console.error('Input element not found'); // Debugging line
        } else {
            console.log('Input Element:', this.inputElement); // Debugging line
        }
    
        this.setupEventListeners();
        this.printWelcome();
    }
    
    

    printWelcome() {
        this.print('Terminal initialized...', styles.centered);
        this.print('Type "help" for available commands.', styles.centered);
    }

    print(text: string, type = styles.output) {
        console.log('Printing text:', text); // Debugging line
        const lines = text.split('\n');
        lines.forEach(lineText => {
            const line = document.createElement('div');
            line.className = `${styles.terminalLine} ${type}`;
            line.textContent = lineText;
            this.outputElement.appendChild(line);
            console.log('Appended line:', line); // Debugging line
            // Force scroll after each line
            this.container.scrollTop = this.container.scrollHeight;
            this.outputElement.scrollTop = this.outputElement.scrollHeight;
        });
        // Ensure final scroll
        requestAnimationFrame(() => {
            this.container.scrollTop = this.container.scrollHeight;
            this.outputElement.scrollTop = this.outputElement.scrollHeight;
        });
    }
    
    
    

    setupEventListeners() {
        this.inputElement.addEventListener('keydown', (e) => {
            console.log('Key pressed:', e.key); // Debugging line
            if (e.key === 'Enter') {
                const command = this.inputElement.value?.trim();
                console.log('Command entered:', command); // Debugging line
                if (command) {
                    this.executeCommand(command);
                    this.history.push(command);
                    this.historyIndex = this.history.length;
                    this.inputElement.value = '';
                } else {
                    console.log('No command entered'); // Debugging line
                }
            }
        });

        this.inputElement.focus();
        this.container.addEventListener('click', () => this.inputElement.focus());
    }

    // Update the Terminal class to pass the print function to executeCommand
    executeCommand(command: string) {
    this.print(`> ${command}`, styles.command);
    executeCommand(command, this.print.bind(this));
}
}
