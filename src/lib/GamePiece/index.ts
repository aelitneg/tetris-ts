import { COLORS, GAME_COLS, GAME_ROWS } from "../../config";

export default class GamePieceImpl implements GamePiece {
    position: Array<Coordinate>;
    xOffset: number;
    cols: number;
    rows: number;
    color: Color;
    locking: boolean;
    constructor() {
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

        this.position.forEach(p => {
            transform.push({ x: p.x - 1, y: p.y });
        });

        return transform;
    }

    /**
     * Get coordinates for a move to the right
     */
    getRightTransform(): Array<Coordinate> {
        const transform: Array<Coordinate> = [];

        this.position.forEach(p => {
            transform.push({ x: p.x + 1, y: p.y });
        });

        return transform;
    }

    /**
     * Get coordinates for a move down
     */
    getDownTransform(): Array<Coordinate> {
        const transform: Array<Coordinate> = [];

        this.position.forEach(p => {
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
}
