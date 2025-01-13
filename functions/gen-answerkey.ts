import { Request, Response } from 'express';

type Grid = string[][]; // Grid is now a 2D array of strings
type Position = { row: number; col: number };

function generateUniqueThreeDigitNumbers(): string[] {
    const numbers: string[] = [];
    for (let i = 1; i <= 999; i++) {
        const paddedNum = i < 10 ? `00${i}` : i < 100 ? `0${i}` : `${i}`;
        numbers.push(paddedNum);
    }

    // Shuffle the array using the Fisher-Yates algorithm
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    // Take the first 144 numbers
    return numbers.slice(0, 144);
}

function createGrid(): Grid {
    const numbers = generateUniqueThreeDigitNumbers();
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

function findSequence(grid: Grid, startPos: Position, length: number, visited: Set<string>): string[] {
    let currentPos = startPos;
    const sequence: string[] = [grid[currentPos.row][currentPos.col]];
    visited.add(sequence[0]);

    while (sequence.length < length) {
        const adjacentPositions = getAdjacentPositions(currentPos);
        const availablePositions = adjacentPositions.filter(pos => !visited.has(grid[pos.row][pos.col]));

        if (availablePositions.length === 0) {
            // If no available adjacent positions, return the incomplete sequence
            return sequence;
        }

        const nextPos = availablePositions[Math.floor(Math.random() * availablePositions.length)];
        sequence.push(grid[nextPos.row][nextPos.col]);
        visited.add(sequence[sequence.length - 1]);
        currentPos = nextPos;
    }

    return sequence;
}

function findSequences(grid: Grid): { tier1: string[]; tier2: string[]; tier3: string[] } {
    const visited: Set<string> = new Set();
    const maxAttempts = 100; // Safeguard to prevent infinite loops
    let attempts = 0;

    while (attempts < maxAttempts) {
        const startPos: Position = {
            row: Math.floor(Math.random() * 12),
            col: Math.floor(Math.random() * 12),
        };

        // Find tier1 sequence (6 numbers)
        const tier1 = findSequence(grid, startPos, 6, visited);
        if (tier1.length < 6) {
            attempts++;
            visited.clear();
            continue;
        }

        // Find tier2 sequence (8 numbers) starting from the last number of tier1
        const tier2StartPos = { row: startPos.row, col: startPos.col }; // Update to the last position of tier1
        const tier2 = findSequence(grid, tier2StartPos, 8, visited);
        if (tier2.length < 8) {
            attempts++;
            visited.clear();
            continue;
        }

        // Find tier3 sequence (10 numbers) starting from the last number of tier2
        const tier3StartPos = { row: startPos.row, col: startPos.col }; // Update to the last position of tier2
        const tier3 = findSequence(grid, tier3StartPos, 10, visited);
        if (tier3.length < 10) {
            attempts++;
            visited.clear();
            continue;
        }

        return { tier1, tier2, tier3 };
    }

    throw new Error("Failed to generate valid sequences within the allowed attempts.");
}

export default async function handler(req: Request, res: Response) {
    try {
        console.log("Generating grid...");
        const grid = createGrid();
        console.log("Grid generated successfully.");

        console.log("Finding sequences...");
        const sequences = findSequences(grid);
        console.log("Sequences found:", sequences);

        // Return the grid and sequences as a JSON response
        res.status(200).json({
            success: true,
            grid, // Grid is now a 12x12 array of strings
            sequences, // Sequences include tier1, tier2, and tier3
        });
    } catch (error) {
        console.error("Error generating grid and sequences:", error);
        res.status(500).json({ 
            success: false,
            error: "Internal Server Error",
            message: error instanceof Error ? error.message : "An unknown error occurred.",
        });
    }
}