import ICoordinate from "./ICoordinate"; // eslint-disable-line no-unused-vars

export default class GamePiece {
    position: Array<ICoordinate>;

    constructor(initialPosition: Array<ICoordinate>) {
        this.position = initialPosition;
    }

    /**
     * Get coordinates for a move to the left
     */
    getLeftTransform() {
        const transform: Array<ICoordinate> = [];

        this.position.forEach(p => {
            transform.push({ x: p.x - 1, y: p.y });
        });

        return transform;
    }

    /**
     * Get coordinates for a move to the right
     */
    getRightTransform() {
        const transform: Array<ICoordinate> = [];

        this.position.forEach(p => {
            transform.push({ x: p.x + 1, y: p.y });
        });

        return transform;
    }

    /**
     * Get coordinates for a move down
     */
    getDownTransform() {
        const transform: Array<ICoordinate> = [];

        this.position.forEach(p => {
            transform.push({ x: p.x, y: p.y + 1 });
        });

        return transform;
    }
}
