import GamePiece from "./GamePiece";
import { Coordinate } from ".";
export default class ZType extends GamePiece {
    /**
     * Piece Map
     * 0 1
     *   2 3
     */
    constructor();
    /**
     * Determine the orientation of the piece to
     * peform the correct transformation
     */
    getTransform(): Array<Coordinate>;
    /**
     * Make piece horizontal
     * @param xOffset
     * @param yOffset
     */
    private _horizontalTransform;
    /**
     * Make piece vertical
     * @param yOffset
     * @param xOffset
     */
    private _verticalTransform;
}
