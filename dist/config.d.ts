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
export declare const COLORS: Array<Color>;
/**
 * Game Board Dimmensions
 *
 * These options configure how many game spaces
 * are on the game board.
 */
export declare const GAME_COLS = 10;
export declare const GAME_ROWS = 20;
/**
 * Frame Rate
 *
 * This option controls the 'frame rate,' or the
 * duration of each game cycle. This is specifically
 * the amout of time for each frame.
 * per second.
 */
export declare const FRAME_CONST = 60.0988;
