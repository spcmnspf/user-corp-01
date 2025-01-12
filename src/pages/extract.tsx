import BaseLayout from '@/layouts/BaseLayout';
import { ReactElement, useEffect, useState } from 'react';
import styles from '../styles/extractPortal.module.css';
import { generatePuzzle, checkCode } from '../components/extractPortal';

function ExtractPage() {
  const [grid, setGrid] = useState<string[][] | null>(null);
  const [sequence, setSequence] = useState<string[] | null>(null);
  const [currentHint, setCurrentHint] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const initPuzzle = async () => {
      const result = await generatePuzzle();
      if (result.error) {
        console.error(result.error);
        setErrorMessage(result.error);
      } else if (result.gridNumbers && result.answerKey) {
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
      const numbers = userInput.split(/\s+/).map((num) => num.trim());
      const result = checkCode(numbers, sequence, currentHint);
      if (result.valid) {
        setCurrentHint(result.currentHint);
        setErrorMessage(result.error || '');

        // Check if the entire sequence has been guessed
        if (result.currentHint === sequence.length) {
          setUserInput(''); // Clear the input field
          setErrorMessage('Congratulations! Chain completed!');
        }
      } else {
        setCurrentHint(0); // Reset to the beginning if the guess is incorrect
        setErrorMessage(result.error || 'Invalid sequence. Try again.');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
    setErrorMessage(''); // Clear the error message when the input changes
  };

  const handleInputClick = () => {
    setErrorMessage(''); // Clear the error message when the input is clicked
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCheckCode(); // Trigger code check when Enter is pressed
    }
  };

  return (
    <div className={styles.container}>
      {/* Grid for displaying numbers */}
      {grid && (
        <div id="number-grid" className={styles.numberGrid}>
          {grid.map((row, rowIndex) =>
            row.map((number, colIndex) => {
              // Check if the number is part of the correctly guessed sequence
              const isCorrect = sequence && sequence.slice(0, currentHint).includes(number);
              const isFirstNumber = sequence && number === sequence[0];
              const isLastNumber = sequence && number === sequence[sequence.length - 1];

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`${styles.gridNumber} ${
                    isFirstNumber ? styles.hintStart : ''
                  } ${
                    isLastNumber ? styles.hintEnd : ''
                  } ${
                    isCorrect && !isFirstNumber && !isLastNumber ? styles.correct : '' // Apply correct class only if it's not the first or last number
                  }`}
                >
                  {number}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tracker, error, and hint container */}
      {sequence && (
        <div className={styles.trackerAndHintContainer}>
          <div id="number-set-tracker" className={styles.numberSetTracker}>
            Sequence: {sequence.slice(0, currentHint).join(', ')}
          </div>
          {errorMessage && (
            <div id="error-container" className={styles.errorContainer}>
              {errorMessage}
            </div>
          )}
          <p id="hint" className={styles.hint}>
  {sequence ? (
    <>
      Code starts at{' '}
      <span className={`${styles.hintBox} ${styles.hintStart}`}>
        {sequence[0]}
      </span>{' '}
      and ends at{' '}
      <span className={`${styles.hintBox} ${styles.hintEnd}`}>
        {sequence[sequence.length - 1]}
      </span>
    </>
  ) : (
    'Loading...'
  )}
</p>
        </div>
      )}

      {/* Input and button container */}
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange} // Clear error on input change
          onClick={handleInputClick} // Clear error on input click
          onKeyDown={handleKeyDown} // Listen for Enter key press
          placeholder="Enter code (e.g., 001 002 003)"
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