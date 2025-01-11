import BaseLayout from '@/layouts/BaseLayout';
import { ReactElement, useEffect, useState } from 'react';
import styles from '../styles/extractPortal.module.css';
import { generatePuzzle, checkCode } from '../components/extractPortal';

function ExtractPage() {
  const [grid, setGrid] = useState<number[][] | null>(null);
  const [sequence, setSequence] = useState<number[] | null>(null);
  const [currentHint, setCurrentHint] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const initPuzzle = async () => {
      const result = await generatePuzzle();
      if (result.error) {
        console.error(result.error); // Log the error
        setErrorMessage(result.error); // Display error to the user
      } else if (result.gridNumbers && result.answerKey) {
        // Convert the flat array into a 12x12 grid
        const grid = [];
        for (let i = 0; i < 12; i++) {
          grid.push(result.gridNumbers.slice(i * 12, (i + 1) * 12));
        }
        setGrid(grid);
        setSequence(result.answerKey);
      }
    };
    initPuzzle();
  }, []);

  const handleCheckCode = () => {
    if (sequence) {
      const numbers = userInput.split(',').map((num) => parseInt(num.trim(), 10));
      const result = checkCode(numbers, sequence, currentHint);
      if (result.valid) {
        setCurrentHint(result.currentHint);
        setErrorMessage(''); // Clear any previous error message
      } else {
        setErrorMessage(result.error || 'Invalid sequence. Try again.');
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
      {grid && (
        <div id="number-grid" className={styles.numberGrid}>
          {grid.map((row, rowIndex) =>
            row.map((number, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`${styles.gridNumber} ${
                  sequence && number === sequence[0] ? styles.hintStart : ''
                } ${
                  sequence && number === sequence[5] ? styles.hintEnd : ''
                }`}
              >
                {number}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tracker for displaying the current sequence */}
      {sequence && (
        <div id="number-set-tracker" className={styles.numberSetTracker}>
          Sequence: {sequence.slice(0, currentHint + 1).join(', ')}
        </div>
      )}

      {/* Hint for guiding the user */}
      <p id="hint" className={styles.hint}>
        {sequence
          ? `Find the chain of numbers starting at ${sequence[0]} and ending at ${sequence[5]}`
          : 'Loading...'}
      </p>

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