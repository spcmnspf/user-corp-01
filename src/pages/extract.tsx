// extract.tsx

import BaseLayout from '@/layouts/BaseLayout';
import { ReactElement, useEffect, useState } from 'react';
import styles from '../styles/extractPortal.module.css';
import { generatePuzzle, checkCode } from '../components/extractPortal';

function ExtractPage() {
    const [answerKey, setAnswerKey] = useState(null);
    const [currentHint, setCurrentHint] = useState(0);

    useEffect(() => {
      const initPuzzle = async () => {
          const result = await generatePuzzle();
          if (result.error) {
              console.error(result.error); // Log the error
              document.getElementById('hint').textContent = result.error; // Display error to the user
          } else if (result.answerKey) {
              setAnswerKey(result.answerKey);
          }
      };
      initPuzzle();
  }, []);

    const handleCheckCode = (numbers) => {
        if (answerKey) {
            const result = checkCode(numbers, answerKey, currentHint);
            if (result.valid) {
                setCurrentHint(result.currentHint);
            }
        }
    };

    return (
        <div className={styles.container}>
            <div id="number-grid" className={styles.numberGrid}></div>
            <div id="number-set-tracker" className={styles.numberSetTracker}></div>
            <p id="hint" className={styles.hint}></p>
            {/* Add input or other UI elements to handle user input for checking the code */}
        </div>
    );
}

ExtractPage.getLayout = function getLayout(page: ReactElement) {
    return <BaseLayout title="Extract">{page}</BaseLayout>;
};

export default ExtractPage;