import { useEffect, useRef } from 'react'; // Add useRef
import { data } from '@/data/info';
import BaseLayout from '@/layouts/BaseLayout';
import Terminal from '@/utils/terminalTS'; // Updated import
import Modal from 'react-modal';
import { ReactElement } from 'react';

function IndexPage() {
  const terminalContainerRef = useRef<HTMLDivElement | null>(null); // Ref for the terminal container

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

      // Render the Terminal component
      <Terminal container={terminalContainer} />;

      // Cleanup function
      return () => {
        if (terminalContainerRef.current) {
          document.body.removeChild(terminalContainerRef.current);
        }
      };
    }
  }, []);

  return (
    <>
      <div className="grid grid-flow-row gap-2 py-4 text-center sm:py-8">
        <h1 className="text-dim text-[44px] sm:text-[68px] font-semibold leading-tight drop-shadow-sm">
          <span className="stroke">
            {/* {conference.name.substring(0, conference.name.lastIndexOf(' '))} */}
          </span>{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-pink-700">
            {/* {conference.name.split(' ').splice(-1)} */}
          </span>
        </h1>

        <div className="max-w-sm mx-auto space-y-1 text-center">
          {/* <p> {conference.location}</p> */}
          <p className="text-center text-list">
            {/* {`${new Date(conference.start_date).toDateString()} to 
              ${new Date(conference.end_date).toDateString()}`} */}
          </p>
        </div>

        {/* <SubscribeToConference conferenceId={conference.id} /> */}
      </div>

      <div className="flex flex-col max-w-4xl mx-auto">
        <div className="flex flex-col py-2 text-center">
          <div className="grid grid-cols-1 gap-4 py-5 md:grid-cols-3 gap-y-12 place-content-between">
            {/* {getDatesInRange(conference.start_date, conference.end_date).map(
              (day, index) => (
                <Day
                  key={day.getUTCDay()}
                  dayNumber={index + 1}
                  talks={
                    conference.talks.filter(
                      (talk) =>
                        new Date(talk.start_date).getUTCDay() ===
                        day.getUTCDay(),
                    ) || []
                  }
                />
              ),
            )} */}
          </div>
        </div>
      </div>
    </>
  );
}

IndexPage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout title={data.pageTitle}>{page}</BaseLayout>;
};

export default IndexPage;