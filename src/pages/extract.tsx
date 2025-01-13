import BaseLayout from '@/layouts/BaseLayout';
import { ReactElement, useEffect, useState } from 'react';
import styles from '../styles/extractPortal.module.css';
import { generatePuzzle, checkCode, handleInputChange } from '../components/extractPortal';

function ExtractPage() {
  const [grid, setGrid] = useState<string[][] | null>(null);
  const [sequence, setSequence] = useState<string[] | null>(null);
  const [currentCorrect, setCurrentCorrect] = useState(0);
  const [userInputs, setUserInputs] = useState<string[]>([]);
  const [infoMessage, setInfoMessage] = useState<{ 
    message: string; 
    type: 'error' | 'success' | 'info'; 
    showProceedButtons?: boolean; // Add a flag to control the visibility of proceed buttons
  }>({ message: '', type: 'info' });
  const [correctNumbers, setCorrectNumbers] = useState<Set<string>>(new Set());
  const [tier, setTier] = useState(1); // Track the current tier

  // Load puzzle data from local storage or generate a new puzzle
  const initPuzzle = async (tier = 1) => {
    const storedPuzzle = localStorage.getItem('puzzleData');
    if (storedPuzzle) {
      const { grid: storedGrid, sequence: storedSequence, tier: storedTier } = JSON.parse(storedPuzzle);
      setGrid(storedGrid);
      setSequence(storedSequence);
      setUserInputs(new Array(storedSequence.length).fill(''));
      setInfoMessage({ message: `There are ${storedSequence.length - 2} missing codes in the sequence. Type in the code to complete the data extraction.`, type: 'info' });
      setCorrectNumbers(new Set());
      setTier(storedTier);
    } else {
      const result = await generatePuzzle(tier); // Pass the current tier to generatePuzzle
      if (result.error) {
        console.error(result.error);
        setInfoMessage({ message: result.error, type: 'error' });
      } else if (result.gridNumbers && result.answerKey) {
        const grid = [];
        for (let i = 0; i < 12; i++) {
          grid.push(result.gridNumbers.slice(i * 12, (i + 1) * 12));
        }
        setGrid(grid);
        setSequence(result.answerKey);
        setUserInputs(new Array(result.answerKey.length).fill(''));
        setInfoMessage({ message: `There are ${result.answerKey.length - 2} missing codes in the sequence. Type in the code to complete the data extraction.`, type: 'info' });
        setCorrectNumbers(new Set());
        setTier(tier);
  
        // Save puzzle data to local storage
        localStorage.setItem('puzzleData', JSON.stringify({ grid, sequence: result.answerKey, tier }));
      }
    }
  };
  // Reinitialize the puzzle when the tier changes
  useEffect(() => {
    initPuzzle(tier);
  }, [tier]);

  // Manual refresh puzzle button handler
  const handleRefreshPuzzle = async () => {
    localStorage.removeItem('puzzleData'); // Clear stored puzzle data
    await initPuzzle(tier);
  };

  const handleCheckCode = (inputs: string[]) => {
    if (sequence) {
      const numbers = inputs.map((input) => input.trim());

      console.log('User Input:', numbers);
      console.log('Sequence:', sequence);
      console.log('Current Correct:', currentCorrect);

      const result = checkCode(numbers, sequence, currentCorrect);
      console.log('Validation Result:', result);

      if (result.valid) {
        // Update correct numbers in the grid
        const newCorrectNumbers = new Set(correctNumbers);
        numbers.forEach((num) => newCorrectNumbers.add(num));
        setCorrectNumbers(newCorrectNumbers);

        setCurrentCorrect(result.currentCorrect);
        setInfoMessage({ message: result.error || '', type: 'success' });

        // Check if the entire sequence has been matched (4-sequence check)
        if (result.currentCorrect === sequence.length - 2) {
          setUserInputs(new Array(sequence.length).fill(''));

          // Show success message with a delay before showing the proceed buttons
          setInfoMessage({ message: 'Congratulations! Chain completed!', type: 'success' });
          setTimeout(() => {
            if (tier < 3) {
              setInfoMessage({ 
                message: 'Congratulations! Chain completed!', 
                type: 'success', 
                showProceedButtons: true, // Show proceed buttons after delay
              });
            }
          }, 2000); // 2-second delay
        } else {
          setInfoMessage({ message: `There are ${sequence.length - result.currentCorrect - 2} missing codes in the sequence. Type in the code to complete the data extraction.`, type: 'info' });
        }
      } else {
        setCurrentCorrect(result.currentCorrect); // Reset correct guesses
        setUserInputs(new Array(sequence.length).fill('')); // Reset userInputs on incorrect guess
        setCorrectNumbers(new Set()); // Reset correct numbers
        setInfoMessage({ message: 'Incorrect code. Try again.', type: 'error' });
      }

      return result;
    }
    return null;
  };

  const handleInputChangeWrapper = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (index !== 0 && index !== sequence.length - 1) {
        const value = e.target.value.replace(/\D/g, ''); // Allow only numeric input
        if (value.length <= 3) {
            handleInputChange(
                index, // `index` is explicitly used here
                value,
                userInputs,
                setUserInputs,
                handleCheckCode,
                setCorrectNumbers
            );
        }
    }
  };

  // Handle proceeding to the next tier
  const handleProceedToNextTier = () => {
    setTier((prevTier) => prevTier + 1); // Increment the tier
    setInfoMessage({ message: '', type: 'info', showProceedButtons: false }); // Reset the info message
  };

  // Handle staying on the current tier
  const handleStayOnCurrentTier = () => {
    setInfoMessage({ message: '', type: 'info', showProceedButtons: false }); // Reset the info message
  };

  return (
    <div className={styles.container}>
      {grid && (
        <div id="number-grid" className={styles.numberGrid}>
          {grid.map((row, rowIndex) =>
            row.map((number, colIndex) => {
              const isCorrect = correctNumbers.has(number);
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
                    isCorrect ? styles.correct : ''
                  }`}
                >
                  {number}
                </div>
              );
            })
          )}
        </div>
      )}

      {infoMessage.message && (
        <div
          id="information-container"
          className={`${styles.informationContainer} ${
            infoMessage.type === 'error' ? styles.error : infoMessage.type === 'success' ? styles.success : styles.info
          }`}
        >
          {infoMessage.message}
          {infoMessage.showProceedButtons && (
            <div className={styles.proceedButtonsContainer}>
              <button onClick={handleProceedToNextTier} className={styles.proceedButton}>
                Proceed to Next Tier
              </button>
              <button onClick={handleStayOnCurrentTier} className={styles.stayButton}>
                Stay on Current Tier
              </button>
            </div>
          )}
        </div>
      )}

      {sequence && (
        <div className={styles.inputContainer}>
          {sequence.map((num, index) => (
            <input
              key={index}
              id={`input-${index}`}
              type="text"
              value={
                index === 0 ? sequence[0] :
                index === sequence.length - 1 ? sequence[sequence.length - 1] :
                userInputs[index]
              }
              onChange={(e) => handleInputChangeWrapper(index, e)}
              className={`${styles.inputField} ${
                index === 0 ? styles.hintStart : index === sequence.length - 1 ? styles.hintEnd : ''
              }`}
              disabled={index === 0 || index === sequence.length - 1}
              maxLength={3}
            />
          ))}
        </div>
      )}

      {/* Add a manual refresh puzzle button */}
      <button onClick={handleRefreshPuzzle} className={styles.refreshButton}>
        Refresh Puzzle
      </button>
    </div>
  );
}

ExtractPage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout title="Extract">{page}</BaseLayout>;
};

export default ExtractPage;