import { useAuthenticationStatus, useSignOut } from '@nhost/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { twMerge } from 'tailwind-merge';
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    openLoginModal: () => void;
  }
}
import { generateNodeName } from '@/utils/generateNodeName';
import Modal from 'react-modal'; // Correct import statement
import { nhost } from '@/utils/nhost'; // Make sure to import nhost
import { Terminal } from '@/utils/terminalTS'; // Import Terminal

export function Header() {
  const { asPath } = useRouter();
  const { isLoading, isAuthenticated } = useAuthenticationStatus();
  const { signOut } = useSignOut();
  const [nodeName, setNodeName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setNodeName(generateNodeName());
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      Modal.setAppElement('#__next'); // Set the app element for accessibility
    }
  }, []);

  useEffect(() => {
    // Expose the function to open the modal globally
    window.openLoginModal = () => setIsModalOpen(true);
  }, []);

  const handleLogin = async () => {
    try {
      await nhost.auth.signIn({
        provider: 'google',
      });
      setIsModalOpen(false);
      initializeTerminal(); // Initialize terminal after login
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };

  const initializeTerminal = () => {
    const terminalContainer = document.createElement('div');
    terminalContainer.className = 'terminal-container'; // Add class for blurring effect
    terminalContainer.style.position = 'fixed';
    terminalContainer.style.top = '50%';
    terminalContainer.style.left = '50%';
    terminalContainer.style.transform = 'translate(-50%, -50%)';
    terminalContainer.style.width = '80%';
    terminalContainer.style.height = '60%';
    terminalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    terminalContainer.style.border = '1px solid #00fff2';
    terminalContainer.style.borderRadius = '4px';
    terminalContainer.style.boxShadow = '0 0 20px rgba(0, 255, 242, 0.2)';
    terminalContainer.style.overflow = 'hidden';
    terminalContainer.style.zIndex = '999'; // Ensure terminal has a lower z-index than the modal
    terminalContainer.style.padding = '10px';
    document.body.appendChild(terminalContainer);

    new Terminal(terminalContainer);
  };

  return (
    <header className="sticky border-b bg-header border-b-brd">
      <div className="flex flex-row max-w-5xl p-4 mx-auto place-content-between">
        <Link href="/" passHref>
          <a className="self-center font-medium text-white text-md hover:underline">
            {nodeName}
          </a>
        </Link>

        <nav
          className="self-center hidden md:block"
          aria-label="Main navigation"
        >
          <ul className="grid items-center w-full grid-flow-col gap-2 text-sm font-medium list-none text-list">
            {/* <li
              className={twMerge(
                'hover:text-white',
                asPath === '/' && 'text-white',
              )}
            >
              <Link href="/" passHref>
                <a className="px-2">Home</a>
              </Link>
            </li>

            <li
              className={twMerge(
                'hover:text-white',
                asPath === '/speakers' && 'text-white',
              )}
            >
              <Link href="/speakers" passHref>
                <a className="px-2">Speakers</a>
              </Link>
            </li>

            <li
              className={twMerge(
                'hover:text-white',
                asPath === '/talks' && 'text-white',
              )}
            >
              <Link href="/talks" passHref>
                <a className="px-2">Talks</a>
              </Link>
            </li> */}

            <li
              className={twMerge(
                'hover:text-white',
                asPath === '/about' && 'text-white',
              )}
            >
              <Link href="/about" passHref>
                <a className="px-2">About</a>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex">
          {isAuthenticated && (
            <div className="grid items-center grid-flow-col gap-2 md:gap-4">
              <button
                onClick={signOut}
                className="flex items-center self-end justify-center w-full px-2 py-1 text-xs transition-colors duration-200 border rounded-md text-list hover:border-white hover:text-white border-list"
              >
                Sign Out
              </button>
            </div>
          )}

          {!isAuthenticated && !isLoading && (
            <div className="grid items-center grid-flow-col gap-2 md:gap-4">
              {/* Hide the Sign In link */}
              {/* <Link href="/sign-in" passHref>
                <a className="flex items-center self-end justify-center w-full px-2 py-1 text-xs transition-colors duration-200 border rounded-md text-list hover:border-white hover:text-white border-list">
                  Sign In
                </a>
              </Link> */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center self-end justify-center w-full px-2 py-1 text-xs transition-colors duration-200 border rounded-md text-list hover:border-white hover:text-white border-list"
              >
                Login
              </button>
            </div>
          )}

          {isLoading && <div className="w-16" />}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Login Modal"
        className="modal"
        overlayClassName="modal-overlay"
        onAfterOpen={() => {
          document.body.classList.add('modal-open');
        }}
        onAfterClose={() => {
          document.body.classList.remove('modal-open');
        }}
        style={{
          overlay: {
            zIndex: 1000, // Set a higher z-index for the overlay
          },
          content: {
            zIndex: 1001, // Set a higher z-index for the modal content
          },
        }}
      >
        <h2 className="text-lg font-bold">Login</h2>
        <button
          onClick={handleLogin}
          className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          Login with Google
        </button>
        <button
          onClick={() => setIsModalOpen(false)}
          className="px-4 py-2 mt-4 text-white bg-gray-500 rounded hover:bg-gray-700"
        >
          Close
        </button>
      </Modal>

      <style jsx global>{`
        .modal-open .terminal-container {
          filter: blur(5px);
        }
      `}</style>
    </header>
  );
}
