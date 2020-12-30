/**
 * GamePiece
 *
 * This is the base class for all other game pieces. All the
 * game pieces are exntended by this class.
 */
import { COLORS, GAME_COLS, GAME_ROWS } from "../../config";
import { Color, Coordinate, GamePieceType } from ".";

export default class GamePiece {
    type: GamePieceType;
    position: Array<Coordinate>;
    xOffset: number; // Offset to center the piece on the board when generated
    cols: number; // Alias for GAME_COLS
    rows: number; // Alias for GAME_ROWS
    color: Color;
    locking: boolean; // Flag for when a piece can be slid in its final position
    nextPieceMap: Array<Coordinate>; // Coordinates for the next piece hint
    nextPieceDims: { rows: number; cols: number }; // Dims for the next piece hint

    constructor(type: GamePieceType) {
        this.type = type;
        this.cols = GAME_COLS;
        this.rows = GAME_ROWS;

        // Place piece in the middle of the Game Board
        this.xOffset =
            ((GAME_COLS / 2) % 2
                ? GAME_COLS / 2
                : GAME_COLS / 2 - (GAME_COLS % 2)) - 1;

        this.color =
            COLORS[Math.floor(Math.random() * Math.floor(COLORS.length))];
    }

    /**
     * Get coordinates for a move to the left
     */
    getLeftTransform(): Array<Coordinate> {
        const transform: Array<Coordinate> = [];

        this.position.forEach((p) => {
            transform.push({ x: p.x - 1, y: p.y });
        });

        return transform;
    }

    /**
     * Get coordinates for a move to the right
     */
    getRightTransform(): Array<Coordinate> {
        const transform: Array<Coordinate> = [];

        this.position.forEach((p) => {
            transform.push({ x: p.x + 1, y: p.y });
        });

        return transform;
    }

    /**
     * Get coordinates for a move down
     */
    getDownTransform(): Array<Coordinate> {
        const transform: Array<Coordinate> = [];

        this.position.forEach((p) => {
            transform.push({ x: p.x, y: p.y + 1 });
        });

        return transform;
    }

    /**
     * Return generatl transform
     * This method is overriden in each GamePiece sub class
     */
    getTransform(): Array<Coordinate> {
        // Return default transform
        return this.position;
    }

    /**
     * Return deep clone of position
     */
    clonePosition(): Array<Coordinate> {
        return this.position.map((src) => {
            const target: Coordinate = { x: undefined, y: undefined };
            Object.assign(target, src);
            return target;
        });
    }
}
