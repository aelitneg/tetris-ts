/**
 * Game Configuration
 */

export interface IColor {
    color: string;
    border: string;
}

export const COLORS: Array<IColor> = [
    { color: "red", border: "darkred" },
    { color: "orange", border: "black" },
    { color: "yellow", border: "black" },
    { color: "lime", border: "darkgreen" },
    { color: "cyan", border: "darkblue" },
    { color: "blue", border: "darkblue" },
    { color: "magenta", border: "indigo" },
    { color: "indigo", border: "black" },
];

export const GAME_COLS: number = 10; // Columns on the Game Board

export const GAME_ROWS: number = 20; // Rows on the Game Board
