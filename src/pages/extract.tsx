import BaseLayout from '@/layouts/BaseLayout';
import { ReactElement, useEffect, useState } from 'react';
import styles from '../styles/extractPortal.module.css';
import { generatePuzzle, checkCode } from '../components/extractPortal';

function ExtractPage() {
  const [answerKey, setAnswerKey] = useState<number[] | null>(null);
  const [currentHint, setCurrentHint] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const initPuzzle = async () => {
      const result = await generatePuzzle();
      if (result.error) {
        console.error(result.error); // Log the error
        setErrorMessage(result.error); // Display error to the user
      } else if (result.answerKey) {
        setAnswerKey(result.answerKey);
      }
    };
    initPuzzle();
  }, []);

  const handleCheckCode = () => {
    if (answerKey) {
      const numbers = userInput.split(',').map((num) => parseInt(num.trim(), 10));
      const result = checkCode(numbers, answerKey, currentHint);
      if (result.valid) {
        setCurrentHint(result.currentHint);
      }
    }
  };

  return (
    <div className={styles.container}>
      {/* Error container for displaying error messages */}
      {errorMessage && (
        <div id="error-container" className={styles.errorContainer}>
          {errorMessage}
        </div>
      )}

      {/* Grid for displaying numbers */}
      <div id="number-grid" className={styles.numberGrid}></div>

      {/* Tracker for displaying the current sequence */}
      <div id="number-set-tracker" className={styles.numberSetTracker}></div>

      {/* Hint for guiding the user */}
      <p id="hint" className={styles.hint}></p>

      {/* Input and button for user interaction */}
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter numbers separated by commas"
          className={styles.inputField}
        />
        <button onClick={handleCheckCode} className={styles.checkButton}>
          Check Code
        </button>
      </div>
    </div>
  );
}

ExtractPage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout title="Extract">{page}</BaseLayout>;
};

export default ExtractPage;