// extractPortal.js

// Fetch grid and answer key from the provided URL
async function fetchPuzzleData() {
    try {
        const response = await fetch('https://sbnpjmkqdoefeelkfrhy.functions.us-west-2.nhost.run/v1/gen-answerkey');

        // Check if the response status is 500
        if (response.status === 500) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to generate a valid sequence');
        }

        // Check if the response is OK (status 200-299)
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

// Generate grid and answer key
export async function generatePuzzle() {
    const data = await fetchPuzzleData();

    // Check if there was an error fetching the data
    if (data.error) {
        console.error('Error:', data.error);
        return { error: data.error };
    }

    const { grid, sequence } = data;

    // Check if grid is defined and is a 12x12 grid
    if (!Array.isArray(grid) || grid.length !== 12 || grid[0].length !== 12) {
        const errorMessage = 'Error: grid is not defined or is not a 12x12 grid.';
        console.error(errorMessage);
        return { error: errorMessage };
    }

    // Flatten the grid for display
    const gridNumbers = grid.flat();

    return { gridNumbers, answerKey: sequence };
}

// Check the code entered by the user
export function checkCode(numbers, answerKey, currentHint) {
    const requiredLength = currentHint + 2; // Start with 2 numbers, then 3, then 4, etc.
    if (numbers.length !== requiredLength) {
        return { 
            valid: false, 
            currentHint, 
            error: `Error: You must enter the first ${requiredLength} numbers in the sequence.` 
        };
    }

    for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] !== answerKey[i]) {
            return { 
                valid: false, 
                currentHint, 
                error: 'Error: Incorrect sequence. Try again.' 
            };
        }
    }

    currentHint++;
    if (currentHint === 5) {
        return { 
            valid: true, 
            currentHint, 
            error: 'Congratulations! Chain completed!' 
        };
    } else {
        return { 
            valid: true, 
            currentHint, 
            error: `Next number in the sequence: ${answerKey[currentHint]}` 
        };
    }
}