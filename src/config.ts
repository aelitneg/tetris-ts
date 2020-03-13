/**
 * Configuration
 *
 * This file contains configuration options
 * which can be changed to customize the game.
 */
import { Color } from "./lib/GamePiece";

/**
 * Game Piece Colors
 *
 * These are the available colors which are given to
 * GamePieces randomly as they are generated.
 */
export const COLORS: Array<Color> = [
    { color: "red", border: "darkred" },
    { color: "orange", border: "black" },
    { color: "yellow", border: "black" },
    { color: "lime", border: "darkgreen" },
    { color: "cyan", border: "darkblue" },
    { color: "blue", border: "darkblue" },
    { color: "magenta", border: "indigo" },
    { color: "indigo", border: "black" },
];

/**
 * Game Board Dimmensions
 *
 * These options configure how many game spaces
 * are on the game board.
 */
export const GAME_COLS = 10;
export const GAME_ROWS = 20;

/**
 * Frame Rate
 *
 * This option controls the 'frame rate,' or the
 * duration of each game cycle. This is specifically
 * the amout of time for each frame.
 * per second.
 */
export const FRAME_CONST = 60.0988; // Frame Rate
