export default async function handler(req, res) {
  try {
    // Generate all possible 2-digit numbers
    const possibleNumbers: number[] = Array.from({ length: 90 }, (_, i) => i + 10);

    // Shuffle array using Fisher-Yates algorithm
    for (let i = possibleNumbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [possibleNumbers[i], possibleNumbers[j]] = [possibleNumbers[j], possibleNumbers[i]];
    }

    // Take first 144 numbers (12x12 grid)
    const gridNumbers = possibleNumbers.slice(0, 144);

    // Create chain sequence (ensure numbers are adjacent and unique)
    const directions = [
      { row: 0, col: 1 }, // Right
      { row: 1, col: 0 }, // Down
      { row: 0, col: -1 }, // Left
      { row: -1, col: 0 }, // Up
    ];

    const startIndex = Math.floor(Math.random() * 130); // Leave room for chain
    let currentIndex = startIndex;
    const sequence = [gridNumbers[currentIndex]];
    const usedNumbers = new Set<number>([gridNumbers[currentIndex]]);

    for (let i = 1; i < 6; i++) {
      let nextIndex: number;
      let direction;
      let attempts = 0;

      do {
        direction = directions[Math.floor(Math.random() * directions.length)];
        const currentRow = Math.floor(currentIndex / 12);
        const currentCol = currentIndex % 12;
        const nextRow = currentRow + direction.row;
        const nextCol = currentCol + direction.col;

        nextIndex = nextRow * 12 + nextCol;
        attempts++;

        // Early exit if too many attempts (to avoid infinite loops)
        if (attempts > 100) {
          throw new Error("Failed to find a valid sequence");
        }
      } while (
        nextIndex < 0 ||
        nextIndex >= 144 ||
        usedNumbers.has(gridNumbers[nextIndex])
      );

      currentIndex = nextIndex;
      sequence.push(gridNumbers[currentIndex]);
      usedNumbers.add(gridNumbers[currentIndex]);
    }

    // Ensure the sequence has exactly 6 unique numbers
    if (sequence.length !== 6 || new Set(sequence).size !== 6) {
      throw new Error("Invalid sequence generated");
    }

    return res.status(200).json({ gridNumbers, answerKey: sequence });
  } catch (error) {
    console.error("Error generating sequence:", error);
    return res.status(500).json({ error: "Failed to generate a valid sequence" });
  }
}