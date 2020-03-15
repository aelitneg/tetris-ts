import { Color, Coordinate, GamePieceType } from ".";
export default class GamePiece {
    type: GamePieceType;
    position: Array<Coordinate>;
    xOffset: number;
    cols: number;
    rows: number;
    color: Color;
    locking: boolean;
    nextPieceMap: Array<Coordinate>;
    nextPieceDims: {
        rows: number;
        cols: number;
    };
    constructor(type: GamePieceType);
    /**
     * Get coordinates for a move to the left
     */
    getLeftTransform(): Array<Coordinate>;
    /**
     * Get coordinates for a move to the right
     */
    getRightTransform(): Array<Coordinate>;
    /**
     * Get coordinates for a move down
     */
    getDownTransform(): Array<Coordinate>;
    /**
     * Return generatl transform
     * This method is overriden in each GamePiece sub class
     */
    getTransform(): Array<Coordinate>;
}
