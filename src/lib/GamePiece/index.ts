/**
 * GamePiece
 *
 * This file is wrapper / factory for GamePieces, mainly
 * to avoid circular depencies. It exposes some of the data
 * structures associated with game pieces and the factory
 * function which makes the call to randomly generate
 * new game pieces.
 */
import GamePiece from "./GamePiece";
import BlockType from "./BlockType";
import LineType from "./LineType";
import ZType from "./ZType";
import ZInvType from "./ZInvType";
import TType from "./TType";
import LType from "./LType";
import LInvType from "./LInvType";

/**
 * GamePieceTypes
 *
 * These are the different kinds of pieces which can be
 * generated. The inverse pieces are necessary because
 * they are different when rotated.
 */
export enum GamePieceType {
    BLOCK,
    LINE,
    Z,
    Z_INV,
    T,
    L,
    L_INV,
}

export interface Color {
    color: string;
    border: string;
}

/**
 * Coordinate
 *
 * This interface describes a position on the game board.
 */
export interface Coordinate {
    x: number;
    y: number;
}

/**
 * Randomly generate a new game piece
 *
 * This function returns an instance of
 * a class exntended by GamePiece.
 */
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
