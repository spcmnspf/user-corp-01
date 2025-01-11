import { Request, Response } from 'express';

type Grid = number[][];
type Position = { row: number; col: number };

function generateUniqueTwoDigitNumbers(): number[] {
  const numbers: number[] = [];
  const maxAttempts = 1000; // Safeguard to prevent infinite loops
  let attempts = 0;

  while (numbers.length < 144 && attempts < maxAttempts) {
      const num = Math.floor(Math.random() * 99) + 1; // Generates a number between 1 and 99
      if (!numbers.includes(num)) {
          numbers.push(num);
      }
      attempts++;
  }

  if (numbers.length < 144) {
      throw new Error("Failed to generate unique numbers within the allowed attempts.");
  }

  return numbers;
}

function createGrid(): Grid {
    const numbers = generateUniqueTwoDigitNumbers();
    const grid: Grid = [];
    for (let i = 0; i < 12; i++) {
        grid.push(numbers.slice(i * 12, (i + 1) * 12));
    }
    return grid;
}

function getAdjacentPositions(pos: Position): Position[] {
    const { row, col } = pos;
    return [
        { row: row - 1, col }, // Up
        { row: row + 1, col }, // Down
        { row, col: col - 1 }, // Left
        { row, col: col + 1 }, // Right
        { row: row - 1, col: col - 1 }, // Up-Left
        { row: row - 1, col: col + 1 }, // Up-Right
        { row: row + 1, col: col - 1 }, // Down-Left
        { row: row + 1, col: col + 1 }, // Down-Right
    ].filter(p => p.row >= 0 && p.row < 12 && p.col >= 0 && p.col < 12);
}

function findSixNumberSequence(grid: Grid): number[] {
    const visited: Set<number> = new Set();
    const maxAttempts = 100; // Safeguard to prevent infinite loops
    let attempts = 0;

    while (attempts < maxAttempts) {
        const startPos: Position = {
            row: Math.floor(Math.random() * 12),
            col: Math.floor(Math.random() * 12),
        };

        let currentPos = startPos;
        const sequence: number[] = [grid[currentPos.row][currentPos.col]];
        visited.add(sequence[0]);

        while (sequence.length < 6) {
            const adjacentPositions = getAdjacentPositions(currentPos);
            const availablePositions = adjacentPositions.filter(pos => !visited.has(grid[pos.row][pos.col]));

            if (availablePositions.length === 0) {
                // If no available adjacent positions, restart the sequence
                break;
            }

            const nextPos = availablePositions[Math.floor(Math.random() * availablePositions.length)];
            sequence.push(grid[nextPos.row][nextPos.col]);
            visited.add(sequence[sequence.length - 1]);
            currentPos = nextPos;
        }

        if (sequence.length === 6) {
            return sequence;
        }

        attempts++;
        visited.clear();
    }

    throw new Error("Failed to generate a valid sequence within the allowed attempts.");
}

export default async function handler(req: Request, res: Response) {
    try {
        console.log("Generating grid...");
        const grid = createGrid();
        console.log("Grid generated successfully.");

        console.log("Finding six-number sequence...");
        const sequence = findSixNumberSequence(grid);
        console.log("Sequence found:", sequence);

        // Return the grid and sequence as a JSON response
        res.status(200).json({
            success: true,
            grid, // Keep the grid as a 12x12 array
            sequence, // Keep the sequence as is
        });
    } catch (error) {
        console.error("Error generating grid and sequence:", error);
        res.status(500).json({ 
            success: false,
            error: "Internal Server Error",
            message: error instanceof Error ? error.message : "An unknown error occurred.",
        });
    }
}