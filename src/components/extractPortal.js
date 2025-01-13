// extractPortal.js

// Fetch grid and answer key from the provided URL
// Fetch grid and answer key from the provided URL
async function fetchPuzzleData() {
    try {
        const response = await fetch('https://sbnpjmkqdoefeelkfrhy.functions.us-west-2.nhost.run/v1/gen-answerkey');

        if (response.status === 500) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to generate a valid sequence');
        }

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching puzzle data:', error);
        return { error: error.message || 'Could not load puzzle data.' };
    }
}

// Generate grid and answer key based on the current tier
export async function generatePuzzle(tier = 1) {
    const data = await fetchPuzzleData();

    if (data.error) {
        console.error('Error:', data.error);
        return { error: data.error };
    }

    const { grid, sequences } = data;

    if (!Array.isArray(grid) || grid.length !== 12 || grid[0].length !== 12) {
        const errorMessage = 'Error: grid is not defined or is not a 12x12 grid.';
        console.error(errorMessage);
        return { error: errorMessage };
    }

    const gridNumbers = grid.flat();

    // Extract the sequence based on the tier
    let adjustedSequence;
    if (tier === 1) {
        adjustedSequence = sequences.tier1;
    } else if (tier === 2) {
        adjustedSequence = sequences.tier2;
    } else if (tier === 3) {
        adjustedSequence = sequences.tier3;
    } else {
        adjustedSequence = sequences.tier1; // Default to tier1 sequence
    }

    return { gridNumbers, answerKey: adjustedSequence, tier, sequences };
}

// Check the code entered by the user
export function checkCode(numbers, answerKey, currentCorrect) {
    const sequence = answerKey.map(String); // Convert sequence to strings
    const sequenceToCheck = sequence.slice(1, -1); // Only check the middle elements
    const userInput = numbers.map((input) => String(input)); // Convert user input to strings

    // Log the sequence and user input for debugging
    console.log('Sequence to Check:', sequenceToCheck);
    console.log('User Input:', userInput);

    // Check if the user's input matches the sequence sequentially
    for (let i = 0; i <= currentCorrect; i++) {
        if (userInput[i] !== sequenceToCheck[i]) {
            console.log('Validation Failed: Mismatch at index', i);
            return {
                valid: false,
                currentCorrect: 0, // Reset correct guesses on incorrect guess
                error: 'Error: Incorrect sequence. Try again.'
            };
        }
    }

    // Update the currentCorrect if the current index is correct
    const newCorrect = currentCorrect + 1; // Increment on correct guess

    // Check if the entire sequence has been matched (4-sequence check)
    if (newCorrect === sequenceToCheck.length) {
        console.log('Validation Success: Sequence completed!');
        return {
            valid: true,
            currentCorrect: newCorrect,
            error: 'Congratulations! Chain completed!'
        };
    } else {
        console.log('Validation Success: Correct input at index', currentCorrect);
        return {
            valid: true,
            currentCorrect: newCorrect,
            error: 'Correct! Move to the next input.'
        };
    }
}

// Handle input change and auto-focus logic
export function handleInputChange(index, value, userInputs, setUserInputs, handleCheckCode, setCorrectNumbers) {
    if (/^\d*$/.test(value)) { // Ensure the input is numeric
        const newInputs = [...userInputs];
        newInputs[index] = value; // Update the specific input field
        setUserInputs(newInputs);

        // Log the updated user inputs
        console.log('Updated User Inputs:', newInputs);

        // Validate the input if the current field is filled
        if (value.length === 3) {
            const middleInputs = newInputs.slice(1, -1);
            console.log('Middle Inputs to Validate:', middleInputs);

            // Validate the input for the current index only
            const result = handleCheckCode(middleInputs);

            if (!result.valid) {
                console.log('Validation Failed: Mismatch at index', index - 1);
                // Reset all input fields and correct numbers on incorrect guess
                setUserInputs(new Array(userInputs.length).fill(''));
                setCorrectNumbers(new Set());

                // Focus on the first input box (index 1)
                const firstInput = document.getElementById('input-1');
                if (firstInput) {
                    firstInput.focus();
                }
            } else {
                console.log('Validation Success: Correct input at index', index - 1);
                // Move focus to the next input field if the current input is correct
                const nextIndex = index + 1;
                if (nextIndex < userInputs.length) {
                    const nextInput = document.getElementById(`input-${nextIndex}`);
                    if (nextInput) {
                        nextInput.focus();
                    }
                }
            }
        }
    }
}