import GamePiece from "./GamePiece";
import { GamePieceType } from ".";

export default class BlockType extends GamePiece {
    /**
     * Piece Map
     * 0 1
     * 2 3
     */
    constructor() {
        super(GamePieceType.BLOCK);

        this.position = [
            { x: this.xOffset, y: 0 },
            { x: this.xOffset + 1, y: 0 },
            { x: this.xOffset, y: 1 },
            { x: this.xOffset + 1, y: 1 },
        ];
    }
}
