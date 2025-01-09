import { useEffect, useRef } from 'react';
import BaseLayout from '@/layouts/BaseLayout';
import { data } from '@/data/info';
import { executeCommand } from '@/utils/terminalInput';
import styles from '@/styles/terminalTS.module.css';
import { ReactElement } from 'react';

function AboutPage() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.innerHTML = `
        <div class="${styles.terminalBody}">
          <div class="${styles.terminalOutput}"></div>
          <div class="${styles.terminalInputLine}">
            <span class="${styles.prompt}">&gt;</span>
            <input type="text" class="${styles.terminalInput}" spellcheck="false" autocomplete="off">
          </div>
        </div>
      `;

      const outputElement = terminalRef.current.querySelector(`.${styles.terminalOutput}`) as HTMLElement;
      const inputElement = terminalRef.current.querySelector(`.${styles.terminalInput}`) as HTMLInputElement;

      const print = (text: string, type = styles.output) => {
        const lines = text.split('\n');
        lines.forEach(lineText => {
          const line = document.createElement('div');
          line.className = `${styles.terminalLine} ${type}`;
          line.textContent = lineText;
          outputElement.appendChild(line);
          terminalRef.current!.scrollTop = terminalRef.current!.scrollHeight;
          outputElement.scrollTop = outputElement.scrollHeight;
        });
        requestAnimationFrame(() => {
          terminalRef.current!.scrollTop = terminalRef.current!.scrollHeight;
          outputElement.scrollTop = outputElement.scrollHeight;
        });
      };

      const printWelcome = () => {
        print('Welcome to the About Page Terminal...', styles.centered);
        print('Type "help" for available commands.', styles.centered);
      };

      const executeCommandHandler = (command: string) => {
        print(`> ${command}`, styles.command);
        executeCommand(command);
      };

      inputElement.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const command = inputElement.value?.trim();
          if (command) {
            executeCommandHandler(command);
            inputElement.value = '';
          }
        }
      });

      inputElement.focus();
      terminalRef.current.addEventListener('click', () => inputElement.focus());

      printWelcome();
    }
  }, []);

  return (
    <div className="flex flex-col max-w-2xl mx-auto my-6 text-center">
      <div className="mx-auto text-center">
        <svg
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-20 h-20"
          viewBox="0 0 88 88"
        >
          <g filter="url(#a)">
            <path
              d="M68.773 28.825 47.96 16.807a6.087 6.087 0 0 0-6.056 0 6.071 6.071 0 0 0-3.027 5.242v1.568l-1.356-.784a6.087 6.087 0 0 0-6.056 0 6.073 6.073 0 0 0-3.026 5.246v1.568l-1.356-.784a6.087 6.087 0 0 0-6.057 0A6.073 6.073 0 0 0 18 34.109v37.656c0 1.083.629 2.09 1.606 2.56A2.86 2.86 0 0 0 22.609 74l10.322-8.14 15.915 9.189c.44.254.932.379 1.425.379.492 0 .984-.129 1.424-.379a2.853 2.853 0 0 0 1.424-2.466V49.922c0-3.72-2-7.181-5.22-9.041l-5.219-3.015V22.053c0-.803.432-1.553 1.129-1.955a2.266 2.266 0 0 1 2.257 0L66.88 32.112a6.663 6.663 0 0 1 3.322 5.754v28.218c0 .803-.432 1.553-1.129 1.954l-5.515 3.186V43.892c0-3.72-2-7.181-5.219-9.041l-12.813-7.397v4.382l10.916 6.303a6.658 6.658 0 0 1 3.321 5.753v28.972c0 1.01.546 1.958 1.425 2.465.439.254.931.38 1.424.38.492 0 .984-.13 1.424-.38l6.939-4.007A6.073 6.073 0 0 0 74 66.076V37.858a10.493 10.493 0 0 0-5.227-9.033ZM45.994 44.169a6.659 6.659 0 0 1 3.322 5.753v21.021l-13.18-7.61 4.23-3.332a6.016 6.016 0 0 0 2.307-4.754V42.256l3.321 1.913Zm-7.117-4.11v15.18c0 .698-.314 1.345-.86 1.773L21.796 69.803V34.105c0-.803.432-1.553 1.129-1.955a2.266 2.266 0 0 1 2.257 0l3.258 1.88v26.91l3.795-2.992v-29.87c0-.802.432-1.552 1.129-1.954a2.266 2.266 0 0 1 2.257 0l3.257 1.879v7.67l-3.795-2.193v4.386l3.795 2.193Z"
              fill="#fff"
            />
            <path
              d="M69.273 27.959A11.492 11.492 0 0 1 75 37.856v28.22a7.073 7.073 0 0 1-3.526 6.112l-6.94 4.007-.005.004c-.59.335-1.252.51-1.918.51a3.844 3.844 0 0 1-1.925-.514 3.858 3.858 0 0 1-1.924-3.331V43.892a5.658 5.658 0 0 0-2.821-4.887l-10.916-6.303-.5-.289v-6.691l1.5.866 12.813 7.397a11.468 11.468 0 0 1 5.72 9.907v25.6l4.014-2.32h.001c.386-.223.628-.642.628-1.088V37.866a5.663 5.663 0 0 0-2.821-4.887L45.566 20.965l23.706 6.994Zm0 0L48.46 15.94a7.087 7.087 0 0 0-7.055-.001l-.002.001a7.073 7.073 0 0 0-3.524 5.946m31.394 6.072L37.88 21.887m0 0a7.088 7.088 0 0 0-6.912.079l-.002.001a7.074 7.074 0 0 0-3.524 5.95 7.088 7.088 0 0 0-6.913.079l-.002.001A7.073 7.073 0 0 0 17 34.109v37.656c0 1.464.846 2.823 2.17 3.46a3.86 3.86 0 0 0 4.06-.44l9.788-7.72 15.328 8.85a3.845 3.845 0 0 0 1.925.513c.666 0 1.328-.174 1.918-.51l.006-.003a3.854 3.854 0 0 0 1.924-3.332V49.922c0-4.077-2.19-7.869-5.72-9.907l-4.719-2.726V22.053c0-.447.242-.866.628-1.088.388-.224.87-.224 1.258 0l-7.687.922Zm-.002 12.053-2.294-1.326-1.5-.867v6.696l.499.289 3.295 1.904V55.24c0 .391-.174.748-.477.986l-.002.001-14.603 11.514V34.105c0-.447.242-.866.628-1.088.388-.224.87-.224 1.259 0l13.195.923Zm0 0v-5.36l-2.756-1.59a1.266 1.266 0 0 0-1.26 0 1.262 1.262 0 0 0-.627 1.089v30.354l-.381.3-3.795 2.992-1.62 1.277V34.607l-2.756-1.59 13.195.923Zm5.796 21.307V43.986l1.822 1.049a5.658 5.658 0 0 1 2.821 4.887v19.29l-10.403-6.006 3.072-2.42a7.016 7.016 0 0 0 2.688-5.539Z"
              stroke="#000"
              strokeOpacity={0.1}
              strokeWidth={1}
            />
          </g>
          <defs>
            <filter
              id="a"
              x={0}
              y={0}
              width={92}
              height={95.708}
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity={0} result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy={2} />
              <feGaussianBlur stdDeviation={8} />
              <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
              <feBlend
                in2="BackgroundImageFix"
                result="effect1_dropShadow_6_941"
              />
              <feBlend
                in="SourceGraphic"
                in2="effect1_dropShadow_6_941"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      </div>
      <h1 className="mt-4 text-2xl font-semibold text-center text-dim">
        {data.pageTitle}
      </h1>
      <p className="pt-2 text-center">{data.description}</p>
      <div ref={terminalRef} className={styles.terminalContainer}></div>
    </div>
  );
}

AboutPage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout title={data.pageTitle}>{page}</BaseLayout>;
};

export default AboutPage;