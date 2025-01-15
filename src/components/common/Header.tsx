import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { twMerge } from 'tailwind-merge';
import Modal from 'react-modal';
import { authService } from '@/utils/authService'; // Import the authService
import { generateNodeName } from '@/utils/generateNodeName';

// Extend the User type to include user_metadata
type User = {
  id: string;
  email?: string;
  user_metadata?: {
    avatar_url?: string;
  };
};

declare global {
  interface Window {
    openLoginModal: () => void;
    navigateToPage: (path: string) => void;
  }
}

export function Header() {
  const { asPath, push } = useRouter();
  const [nodeName, setNodeName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication status
  const [userAvatar, setUserAvatar] = useState<string | null>(null); // Track user avatar
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Track dropdown state

  useEffect(() => {
    setNodeName(generateNodeName());
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      Modal.setAppElement('#__next');
    }
  }, []);

  useEffect(() => {
    // Expose the function to open the modal globally
    window.openLoginModal = () => setIsModalOpen(true);

    // Expose the function to navigate to a specific page globally
    window.navigateToPage = (path: string) => {
      push(path);
    };
  }, [push]);

  // Subscribe to authentication state changes
  useEffect(() => {
    const updateAuthStatus = () => {
      setIsAuthenticated(authService.isAuthenticated);
      const user = authService.currentUser as User | null; // Cast to the extended User type
      setUserAvatar(user?.user_metadata?.avatar_url || null); // Safely access user_metadata
    };

    // Initial check
    updateAuthStatus();

    // Listen for auth state changes
    const unsubscribe = authService.onAuthStateChanged(updateAuthStatus);

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await authService.signInWithGoogle(); // Use authService for Google login
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout(); // Use authService for logout
    } catch (error) {
      console.error('Error during sign-out:', error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown visibility
  };

  return (
    <header className="sticky border-b bg-header border-b-brd">
      <div className="flex flex-row max-w-5xl p-4 mx-auto place-content-between">
        <Link href="/" passHref legacyBehavior>
          <a className="self-center font-medium text-white text-md hover:underline">
            {nodeName}
          </a>
        </Link>

        <div className="flex items-center gap-4">
          {/* Status Indicator and Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center justify-center w-8 h-8 rounded-full focus:outline-none border border-[#00fff2] shadow-[0_0_20px_rgba(0,255,242,0.2)]"
            >
              {isAuthenticated && userAvatar ? (
                <img
                  src={userAvatar}
                  alt="User Avatar"
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <span className="text-white">?</span> // Display "?" when no user is signed in
              )}
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-header border border-brd rounded-md shadow-lg">
                {/* About Page Link */}
                <Link href="/about" passHref legacyBehavior>
                  <a
                    className="block w-full px-4 py-2 text-sm text-left text-list hover:bg-brd hover:text-white"
                    onClick={() => setIsDropdownOpen(false)} // Close dropdown after clicking
                  >
                    About
                  </a>
                </Link>

                {/* Login/Logout Button */}
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-sm text-left text-list hover:bg-brd hover:text-white"
                  >
                    Sign Out
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsModalOpen(true);
                      setIsDropdownOpen(false); // Close dropdown after clicking
                    }}
                    className="block w-full px-4 py-2 text-sm text-left text-list hover:bg-brd hover:text-white"
                  >
                    Login
                  </button>
                )}
              </div>
            )}
          </div>
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
            zIndex: 1000,
          },
          content: {
            zIndex: 1001,
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