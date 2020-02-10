interface Coordinate {
    x: number;
    y: number;
}

export default class GamePiece {
    position: Array<Coordinate>;

    constructor(initialPosition: Array<Coordinate>) {
        this.position = initialPosition;
    }
}
