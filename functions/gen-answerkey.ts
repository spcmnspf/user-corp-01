export default async function handler(req, res) {
  try {
    const possibleNumbers: number[] = Array.from({ length: 90 }, (_, i) => i + 10);

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

    let sequence;
    let attempts = 0;
    const maxAttempts = 5;

    do {
      try {
        const startIndex = Math.floor(Math.random() * 130);
        let currentIndex = startIndex;
        sequence = [gridNumbers[currentIndex]];
        const usedNumbers = new Set<number>([gridNumbers[currentIndex]]);

        for (let i = 1; i < 6; i++) {
          let nextIndex: number;
          let direction;
          let innerAttempts = 0;

          do {
            direction = directions[Math.floor(Math.random() * directions.length)];
            const currentRow = Math.floor(currentIndex / 12);
            const currentCol = currentIndex % 12;
            const nextRow = currentRow + direction.row;
            const nextCol = currentCol + direction.col;

            nextIndex = nextRow * 12 + nextCol;
            innerAttempts++;

            if (innerAttempts > 200) {
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

        if (sequence.length !== 6 || new Set(sequence).size !== 6) {
          throw new Error("Invalid sequence generated");
        }

        break;
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) {
          return res.status(500).json({ error: "Failed to generate a valid sequence after multiple attempts" });
        }
      }
    } while (true);

    return res.status(200).json({ gridNumbers, answerKey: sequence });
  } catch (error) {
    console.error("Error generating sequence:", error);
    return res.status(500).json({ error: "Failed to generate a valid sequence", details: error.message });
  }
}