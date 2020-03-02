declare interface Handler {
    event: string;
    handler: Function;
    gamePiece?: GamePiece;
    rows?: Array<number>;
}
