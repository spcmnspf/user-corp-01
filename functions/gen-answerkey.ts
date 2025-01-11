export default async function handler(req, res) {
  // Generate all possible 2-digit numbers
  const possibleNumbers: number[] = Array.from({ length: 90 }, (_, i) => i + 10);

  // Shuffle array using Fisher-Yates algorithm
  for (let i = possibleNumbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [possibleNumbers[i], possibleNumbers[j]] = [possibleNumbers[j], possibleNumbers[i]];
  }

  // Take first 64 numbers (8x8 grid)
  const gridNumbers = possibleNumbers.slice(0, 64).map((n) => ({
    value: n,
  }));

  // Create chain sequence (ensure numbers are adjacent and unique)
  const directions = [
    { row: 0, col: 1 }, // Right
    { row: 1, col: 0 }, // Down
    { row: 0, col: -1 }, // Left
    { row: -1, col: 0 }, // Up
  ];
  const startIndex = Math.floor(Math.random() * 59); // Leave room for chain
  let currentIndex = startIndex;
  const sequence = [gridNumbers[currentIndex]];

  for (let i = 1; i < 6; i++) {
    let nextIndex: number;
    do {
      const direction = directions[Math.floor(Math.random() * directions.length)];
      const nextRow = Math.floor(currentIndex / 8) + direction.row;
      const nextCol = (currentIndex % 8) + direction.col;
      nextIndex = nextRow * 8 + nextCol;
    } while (
      nextIndex < 0 ||
      nextIndex >= 64 ||
      sequence.some((num) => num.value === gridNumbers[nextIndex].value)
    );

    currentIndex = nextIndex;
    sequence.push(gridNumbers[currentIndex]);
  }

  const answerKey = sequence.map((n) => n.value);

  return res.status(200).json({ answerKey });
}
