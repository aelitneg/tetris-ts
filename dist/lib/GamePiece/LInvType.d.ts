import GamePiece from "./GamePiece";
import { Coordinate } from ".";
export default class LInvType extends GamePiece {
    /**
     * Piece Map
     * 0 1 2
     *     3
     */
    constructor();
    /**
     * Determine the orientation of the piece to
     * peform the correct transformation
     */
    getTransform(): Array<Coordinate>;
    /**
     * Rotate piece to 0
     * @param xOffset
     * @param yOffset
     */
    private _0Transform;
    /**
     * Rotate piece to 90
     * @param xOffset
     * @param yOffset
     */
    private _90Transform;
    /**
     * Rotate piece to 180
     * @param xOffset
     * @param yOffset
     */
    private _180Transform;
    /**
     * Rotate piece to 270
     * @param xOffset
     * @param yOffset
     */
    private _270Transform;
}
