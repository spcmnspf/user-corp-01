import { Request, Response } from 'express';

type Grid = number[][];
type Position = { row: number; col: number };

function generateUniqueTwoDigitNumbers(): number[] {
    const numbers: number[] = [];
    while (numbers.length < 144) {
        const num = Math.floor(Math.random() * 90) + 10; // Generates a number between 10 and 99
        if (!numbers.includes(num)) {
            numbers.push(num);
        }
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
            sequence.length = 0;
            visited.clear();
            currentPos = {
                row: Math.floor(Math.random() * 12),
                col: Math.floor(Math.random() * 12),
            };
            sequence.push(grid[currentPos.row][currentPos.col]);
            visited.add(sequence[0]);
            continue;
        }

        const nextPos = availablePositions[Math.floor(Math.random() * availablePositions.length)];
        sequence.push(grid[nextPos.row][nextPos.col]);
        visited.add(sequence[sequence.length - 1]);
        currentPos = nextPos;
    }

    return sequence;
}

export default async function handler(req: Request, res: Response) {
    try {
        const grid = createGrid();
        const sequence = findSixNumberSequence(grid);

        // Return the grid and sequence as a JSON response
        res.status(200).json({
            grid,
            sequence,
        });
    } catch (error) {
        console.error("Error generating grid and sequence:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}