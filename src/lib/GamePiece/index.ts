import { GamePieceType } from "../enum";

import BlockType from "./BlockType";
import LineType from "./LineType";
import ZType from "./ZType";
import ZInvType from "./ZInvType";
import TType from "./TType";
import LType from "./LType";
import LInvType from "./LInvType";

export const newGamePiece = function(): GamePiece {
    const gamePieceType: GamePieceType = Math.floor(
        Math.random() * Math.floor(7)
    );

    switch (gamePieceType as GamePieceType) {
        case GamePieceType.BLOCK:
            return new BlockType();
        case GamePieceType.LINE:
            return new LineType();
        case GamePieceType.Z:
            return new ZType();
        case GamePieceType.Z_INV:
            return new ZInvType();
        case GamePieceType.T:
            return new TType();
        case GamePieceType.L:
            return new LType();
        case GamePieceType.L_INV:
            return new LInvType();
        default:
            throw Error(`[tetris-ts] Invalid GamePieceType '${gamePieceType}'`);
    }
};
