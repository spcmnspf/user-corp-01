import { useEffect, useRef, useState } from 'react';
import { data } from '@/data/info';
import BaseLayout from '@/layouts/BaseLayout';
import Terminal from '@/utils/terminalTS';
import Modal from 'react-modal';
import { ReactElement } from 'react';
import { useRouter } from 'next/router'; // Import the useRouter hook
import { executeCommand, getCommands } from '@/utils/terminalInput'; // Import executeCommand and getCommands

function IndexPage() {
  const terminalContainerRef = useRef<HTMLDivElement | null>(null); // Ref for the terminal container
  const [isTerminalMounted, setIsTerminalMounted] = useState(false); // State to track terminal mount
  const router = useRouter(); // Initialize the router

  // Handle command execution and navigation
  const handleTerminalCommand = (input: string) => {
    if (terminalContainerRef.current) {
      const commands = getCommands(() => Promise.resolve()); // Pass a dummy terminateSession function
      const result = executeCommand(input, (text: string) => console.log(text), commands); // Execute the command
  
      // Handle navigation based on the result
      if (result && result.startsWith('navigate:')) {
        const route = result.split(':')[1]; // Extract the route (e.g., '/about')
        router.push(route); // Navigate to the specified route
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      Modal.setAppElement('#__next'); // Set the app element for accessibility

      // Create the terminal container
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
      terminalContainer.style.padding = '10px'; // Add padding to ensure text can be entered
      document.body.appendChild(terminalContainer);

      // Store the container in the ref
      terminalContainerRef.current = terminalContainer;

      // Set the terminal as mounted
      setIsTerminalMounted(true);

      // Cleanup function
      return () => {
        if (terminalContainerRef.current) {
          document.body.removeChild(terminalContainerRef.current);
        }
        setIsTerminalMounted(false); // Reset terminal mount state
      };
    }
  }, []);

  return (
    <>
      {/* Render the Terminal component if the container is mounted */}
      {isTerminalMounted && terminalContainerRef.current && (
        <Terminal container={terminalContainerRef.current} onCommand={handleTerminalCommand} />
      )}
    </>
  );
}

IndexPage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout title={data.pageTitle}>{page}</BaseLayout>;
};

export default IndexPage;