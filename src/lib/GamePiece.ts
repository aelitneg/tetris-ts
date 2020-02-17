import ICoordinate from "./ICoordinate"; // eslint-disable-line no-unused-vars
import { GAME_COLS, GAME_ROWS } from "./Config";
export default class GamePiece {
    position: Array<ICoordinate>;
    xOffset: number;
    cols: number;
    rows: number;
    constructor() {
        this.cols = GAME_COLS;
        this.rows = GAME_ROWS;

        // Place piece in the middle of the Game Board
        this.xOffset =
            ((GAME_COLS / 2) % 2
                ? GAME_COLS / 2
                : GAME_COLS / 2 - (GAME_COLS % 2)) - 1;
    }

    /**
     * Get coordinates for a move to the left
     */
    getLeftTransform() {
        const transform: Array<ICoordinate> = [];

        this.position.forEach(p => {
            transform.push({ x: p.x - 1, y: p.y });
        });

        return transform;
    }

    /**
     * Get coordinates for a move to the right
     */
    getRightTransform() {
        const transform: Array<ICoordinate> = [];

        this.position.forEach(p => {
            transform.push({ x: p.x + 1, y: p.y });
        });

        return transform;
    }

    /**
     * Get coordinates for a move down
     */
    getDownTransform() {
        const transform: Array<ICoordinate> = [];

        this.position.forEach(p => {
            transform.push({ x: p.x, y: p.y + 1 });
        });

        return transform;
    }

    /**
     * Return generatl transform
     * This method is overriden in each GamePiece sub class
     */
    getTransform() {
        // Return default transform
        return this.position;
    }
}
