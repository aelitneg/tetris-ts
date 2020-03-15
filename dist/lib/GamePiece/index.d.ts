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
/**
 * GamePieceTypes
 *
 * These are the different kinds of pieces which can be
 * generated. The inverse pieces are necessary because
 * they are different when rotated.
 */
export declare enum GamePieceType {
    BLOCK = 0,
    LINE = 1,
    Z = 2,
    Z_INV = 3,
    T = 4,
    L = 5,
    L_INV = 6
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
export declare const newGamePiece: () => GamePiece;
