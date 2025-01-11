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
        displayErrorMessage(data.error);
        return { error: data.error };
    }

    const { grid, sequence } = data;

    // Check if grid is defined and is a 12x12 grid
    if (!Array.isArray(grid) || grid.length !== 12 || grid[0].length !== 12) {
        const errorMessage = 'Error: grid is not defined or is not a 12x12 grid.';
        console.error(errorMessage);
        displayErrorMessage(errorMessage);
        return { error: errorMessage };
    }

    // Flatten the grid for display
    const gridNumbers = grid.flat();

    // Create grid HTML
    const gridElement = document.getElementById('number-grid');
    if (gridElement) {
        gridElement.innerHTML = ''; // Clear existing content

        gridNumbers.forEach(num => {
            const element = document.createElement('div');
            element.className = 'grid-number';
            element.textContent = num; // Directly use the number
            gridElement.appendChild(element);
        });

        // Highlight start and end
        const startElement = Array.from(document.querySelectorAll('.grid-number'))
            .find(el => el.textContent == sequence[0]);
        const endElement = Array.from(document.querySelectorAll('.grid-number'))
            .find(el => el.textContent == sequence[5]);

        if (startElement) startElement.classList.add('hint-start');
        if (endElement) endElement.classList.add('hint-end');

        document.getElementById('hint').textContent = 
            `Find the chain of numbers starting at ${sequence[0]} and ending at ${sequence[5]}`;

        // Initialize number set tracker
        updateNumberSetTracker(sequence, 0);

        return { gridNumbers, answerKey: sequence };
    } else {
        const errorMessage = 'Grid element not found.';
        console.error(errorMessage);
        displayErrorMessage(errorMessage);
        return { error: errorMessage };
    }
}

// Update number set tracker
function updateNumberSetTracker(answerKey, currentHint) {
    const tracker = document.getElementById('number-set-tracker');
    if (tracker) {
        const sets = [];
        for (let i = 0; i < currentHint + 1; i++) {
            sets.push(`${answerKey[i]}`);
        }
        tracker.textContent = `Number sets: ${sets.join(', ')}`;
    }
}

// Check the code entered by the user
export function checkCode(numbers, answerKey, currentHint) {
    const requiredLength = currentHint + 2; // Start with 2 numbers, then 3, then 4, etc.
    if (numbers.length !== requiredLength) {
        document.getElementById('hint').textContent = 
            `Error: You must enter the first ${requiredLength} numbers in the sequence.`;
        return { valid: false, currentHint };
    }

    for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] !== answerKey[i]) {
            document.getElementById('hint').textContent = 
                `Error: Incorrect sequence. Try again.`;
            return { valid: false, currentHint };
        }
    }

    // Highlight the newly correct numbers
    for (let i = 0; i < numbers.length; i++) {
        const correctElement = Array.from(document.querySelectorAll('.grid-number'))
            .find(el => el.textContent == answerKey[i]);
        if (correctElement && !correctElement.classList.contains('hint-start') && !correctElement.classList.contains('hint-end')) {
            correctElement.classList.add('correct');
        }
    }

    currentHint++;
    updateNumberSetTracker(answerKey, currentHint);

    if (currentHint === 5) {
        document.getElementById('hint').textContent = 'Congratulations! Chain completed!';
    } else {
        document.getElementById('hint').textContent = 
            `Next number in the sequence: ${answerKey[currentHint]}`;
    }

    return { valid: true, currentHint };
}

// Display error message to the user
function displayErrorMessage(message) {
    const errorContainer = document.getElementById('error-container');
    if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
    }
}