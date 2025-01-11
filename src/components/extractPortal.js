// extractPortal.js

// Fetch grid and answer key from the provided URL
async function fetchPuzzleData() {
    try {
        const response = await fetch('https://sbnpjmkqdoefeelkfrhy.functions.us-west-2.nhost.run/v1/gen-answerkey');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching puzzle data:', error);
        return null;
    }
}

// Generate grid and answer key
export async function generatePuzzle() {
    const data = await fetchPuzzleData();
    if (!data) {
        return { error: 'Could not load puzzle data.' };
    }

    const { gridNumbers, answerKey } = data;

    // Check if gridNumbers is defined and is an array
    if (!Array.isArray(gridNumbers)) {
        console.error('Error: gridNumbers is not defined or is not an array.');
        return { error: 'No puzzle data available.' };
    }

    // Create grid HTML
    const gridElement = document.getElementById('number-grid');
    if (gridElement) {
        gridElement.innerHTML = ''; // Clear existing content

        gridNumbers.forEach(num => {
            const element = document.createElement('div');
            element.className = 'grid-number';
            element.textContent = num.value;
            gridElement.appendChild(element);
        });

        // Highlight start and end
        const startElement = Array.from(document.querySelectorAll('.grid-number'))
            .find(el => el.textContent == answerKey[0]);
        const endElement = Array.from(document.querySelectorAll('.grid-number'))
            .find(el => el.textContent == answerKey[5]);

        if (startElement) startElement.classList.add('hint-start');
        if (endElement) endElement.classList.add('hint-end');

        document.getElementById('hint').textContent = 
            `Find the chain of numbers starting at ${answerKey[0]} and ending at ${answerKey[5]}`;

        // Initialize number set tracker
        updateNumberSetTracker(answerKey, 0);

        return { answerKey };
    } else {
        return { error: 'Grid element not found.' };
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