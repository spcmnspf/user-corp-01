export default async function handler(req, res) {
  try {
    const possibleNumbers: number[] = Array.from({ length: 90 }, (_, i) => i + 10);

    // Shuffle the possible numbers
    for (let i = possibleNumbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [possibleNumbers[i], possibleNumbers[j]] = [possibleNumbers[j], possibleNumbers[i]];
    }

    const gridNumbers = possibleNumbers.slice(0, 144);

    const directions = [
      { row: 0, col: 1 }, // Right
      { row: 1, col: 0 }, // Down
      { row: 0, col: -1 }, // Left
      { row: -1, col: 0 }, // Up
    ];

    // Function to count available neighboring cells for a given index
    const countAvailableNeighbors = (index: number, usedNumbers: Set<number>): number => {
      const currentRow = Math.floor(index / 12);
      const currentCol = index % 12;
      let count = 0;

      for (const direction of directions) {
        const nextRow = currentRow + direction.row;
        const nextCol = currentCol + direction.col;
        const nextIndex = nextRow * 12 + nextCol;

        if (
          nextRow >= 0 &&
          nextRow < 12 &&
          nextCol >= 0 &&
          nextCol < 12 &&
          !usedNumbers.has(gridNumbers[nextIndex])
        ) {
          count++;
        }
      }

      return count;
    };

    // Function to validate the grid before sequence generation
    const validateGrid = (): boolean => {
      const uniqueNumbers = new Set(gridNumbers);
      if (uniqueNumbers.size < 6) {
        console.error("Grid does not have enough unique numbers.");
        return false;
      }

      // Check for isolated regions by ensuring each number has at least one available neighbor
      for (let i = 0; i < gridNumbers.length; i++) {
        if (countAvailableNeighbors(i, new Set()) === 0) {
          console.error("Grid has isolated regions.");
          return false;
        }
      }

      return true;
    };

    // Backtracking function to generate a sequence
    const generateSequence = (startIndex: number, sequence: number[], usedNumbers: Set<number>): number[] | null => {
      if (sequence.length === 6) {
        return sequence;
      }

      const currentRow = Math.floor(startIndex / 12);
      const currentCol = startIndex % 12;

      // Prioritize directions with more available neighbors
      const prioritizedDirections = directions
        .map((direction) => ({
          direction,
          nextRow: currentRow + direction.row,
          nextCol: currentCol + direction.col,
        }))
        .filter(
          ({ nextRow, nextCol }) =>
            nextRow >= 0 && nextRow < 12 && nextCol >= 0 && nextCol < 12
        )
        .map(({ direction, nextRow, nextCol }) => {
          const nextIndex = nextRow * 12 + nextCol;
          return {
            direction,
            nextIndex,
            availableNeighbors: countAvailableNeighbors(nextIndex, usedNumbers),
          };
        })
        .sort((a, b) => b.availableNeighbors - a.availableNeighbors); // Sort by most available neighbors

      for (const { direction, nextIndex } of prioritizedDirections) {
        if (!usedNumbers.has(gridNumbers[nextIndex])) {
          usedNumbers.add(gridNumbers[nextIndex]);
          const result = generateSequence(nextIndex, [...sequence, gridNumbers[nextIndex]], usedNumbers);
          if (result) {
            return result;
          }
          usedNumbers.delete(gridNumbers[nextIndex]); // Backtrack
        }
      }

      return null;
    };

    // Validate the grid before attempting to generate a sequence
    if (!validateGrid()) {
      return res.status(500).json({ error: "Grid validation failed. Unable to generate a valid sequence." });
    }

    let sequence: number[] | null = null;
    let attempts = 0;
    const maxAttempts = 10;

    while (!sequence && attempts < maxAttempts) {
      const startIndex = Math.floor(Math.random() * 144);
      sequence = generateSequence(startIndex, [gridNumbers[startIndex]], new Set([gridNumbers[startIndex]]));
      attempts++;
    }

    // Fallback to a simple sequence if backtracking fails
    if (!sequence) {
      // Define the maximum starting row and column to avoid hitting the edge
      const maxStartRow = 12 - 6; // Maximum starting row to allow 6 steps downward
      const maxStartCol = 12 - 6; // Maximum starting column to allow 6 steps rightward

      // Choose a random starting point within the safe area
      const startRow = Math.floor(Math.random() * maxStartRow);
      const startCol = Math.floor(Math.random() * maxStartCol);
      const startIndex = startRow * 12 + startCol;

      // Choose a random direction (right or down) to ensure the sequence stays within bounds
      const safeDirections = [
        { row: 0, col: 1 }, // Right
        { row: 1, col: 0 }, // Down
      ];
      const direction = safeDirections[Math.floor(Math.random() * safeDirections.length)];

      // Generate the sequence
      sequence = [gridNumbers[startIndex]];
      let currentRow = startRow;
      let currentCol = startCol;

      for (let i = 1; i < 6; i++) {
        currentRow += direction.row;
        currentCol += direction.col;
        const nextIndex = currentRow * 12 + currentCol;
        sequence.push(gridNumbers[nextIndex]);
      }
    }

    return res.status(200).json({ gridNumbers, answerKey: sequence });
  } catch (error) {
    console.error("Error generating sequence:", error);
    return res.status(500).json({ error: "Failed to generate a valid sequence", details: error.message });
  }
}