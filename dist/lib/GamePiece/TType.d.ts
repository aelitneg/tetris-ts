import GamePiece from "./GamePiece";
import { Coordinate } from ".";
export default class TType extends GamePiece {
    /**
     * Piece Map
     * 0 1 2
     *   3
     */
    constructor();
    /**
     * Determine the orientation of the piece to
     * peform the correct transformation
     */
    getTransform(): Array<Coordinate>;
    /**
     * Transform to 0
     * @param xOffset
     * @param yOffset
     */
    private _0Transform;
    /**
     * Transform to 90
     * @param xOffset
     * @param yOffset
     */
    private _90Transform;
    /**
     * Transform to 180
     * @param xOffset
     * @param yOffset
     */
    private _180Transform;
    /**
     * Transform to 270
     * @param xOffset
     * @param yOffset
     */
    private _270Transform;
}
