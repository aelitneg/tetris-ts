/**
 * Global Types
 */

declare interface Coordinate {
    x: number;
    y: number;
}

declare interface Color {
    color: string;
    border: string;
}

declare interface Handler {
    event: string;
    handler: Function;
    gamePiece?: GamePiece;
    rows?: Array<number>;
}

declare interface GamePiece {
    position: Array<Coordinate>;
    xOffset: number;
    cols: number;
    rows: number;
    color: Color;
    locking: boolean;
}
