import GamePiece from "../GamePiece";
import ICoordinate from "../ICoordinate"; // eslint-disable-line no-unused-vars

export default class LInvType extends GamePiece {
    /**
     * Piece Map
     * 0 1 2
     *     3
     */
    constructor() {
        super();

        this.position = [
            { x: this.xOffset - 1, y: 0 },
            { x: this.xOffset, y: 0 },
            { x: this.xOffset + 1, y: 0 },
            { x: this.xOffset + 1, y: 1 },
        ];
    }

    /**
     * Determine the orientation of the piece to
     * peform the correct transformation
     */
    getTransform() {
        if (this.position[2].y === this.position[3].y) {
            if (this.position[2].x > this.position[3].x) {
                return this._180Transform();
            } else {
                return this._0Transform();
            }
        } else {
            if (this.position[2].y < this.position[3].y) {
                return this._90Transform();
            } else {
                return this._270Transform();
            }
        }
    }

    /**
     * Rotate piece to 0
     * @param xOffset
     * @param yOffset
     */
    private _0Transform(
        xOffset?: number,
        yOffset?: number
    ): Array<ICoordinate> {
        xOffset = xOffset ? xOffset : 0;
        yOffset = yOffset ? yOffset : 0;

        const transform: Array<ICoordinate> = [
            {
                x: this.position[0].x + xOffset,
                y: this.position[0].y - 2 + yOffset,
            },
            {
                x: this.position[1].x + 1 + xOffset,
                y: this.position[1].y - 1 + yOffset,
            },
            {
                x: this.position[2].x + 2 + xOffset,
                y: this.position[2].y + yOffset,
            },
            {
                x: this.position[3].x + 1 + xOffset,
                y: this.position[3].y + 1 + yOffset,
            },
        ];

        for (let i: number = 0; i < transform.length; i++) {
            if (transform[i].x < 0) {
                return this._0Transform(++xOffset, yOffset);
            } else if (transform[i].x >= this.cols) {
                return this._0Transform(--xOffset, yOffset);
            } else if (transform[i].y < 0) {
                return this._0Transform(xOffset, ++yOffset);
            } else if (transform[i].y >= this.rows) {
                return this._0Transform(xOffset, --yOffset);
            }
        }

        return transform;
    }

    /**
     * Rotate piece to 90
     * @param xOffset
     * @param yOffset
     */
    private _90Transform(
        xOffset?: number,
        yOffset?: number
    ): Array<ICoordinate> {
        xOffset = xOffset ? xOffset : 0;
        yOffset = yOffset ? yOffset : 0;

        const transform: Array<ICoordinate> = [
            {
                x: this.position[0].x + 2 + xOffset,
                y: this.position[0].y + yOffset,
            },
            {
                x: this.position[1].x + 1 + xOffset,
                y: this.position[1].y + 1 + yOffset,
            },
            {
                x: this.position[2].x + xOffset,
                y: this.position[2].y + 2 + yOffset,
            },
            {
                x: this.position[3].x - 1 + xOffset,
                y: this.position[3].y + 1 + yOffset,
            },
        ];

        for (let i: number = 0; i < transform.length; i++) {
            if (transform[i].x < 0) {
                return this._90Transform(++xOffset, yOffset);
            } else if (transform[i].x >= this.cols) {
                return this._90Transform(--xOffset, yOffset);
            } else if (transform[i].y < 0) {
                return this._90Transform(xOffset, ++yOffset);
            } else if (transform[i].y >= this.rows) {
                return this._90Transform(xOffset, --yOffset);
            }
        }

        return transform;
    }

    /**
     * Rotate piece to 180
     * @param xOffset
     * @param yOffset
     */
    private _180Transform(
        xOffset?: number,
        yOffset?: number
    ): Array<ICoordinate> {
        xOffset = xOffset ? xOffset : 0;
        yOffset = yOffset ? yOffset : 0;

        const transform: Array<ICoordinate> = [
            {
                x: this.position[0].x + xOffset,
                y: this.position[0].y + 2 + yOffset,
            },
            {
                x: this.position[1].x - 1 + xOffset,
                y: this.position[1].y + 1 + yOffset,
            },
            {
                x: this.position[2].x - 2 + xOffset,
                y: this.position[2].y + yOffset,
            },
            {
                x: this.position[3].x - 1 + xOffset,
                y: this.position[3].y - 1 + yOffset,
            },
        ];
        for (let i: number = 0; i < transform.length; i++) {
            if (transform[i].x < 0) {
                return this._180Transform(++xOffset, yOffset);
            } else if (transform[i].x >= this.cols) {
                return this._180Transform(--xOffset, yOffset);
            } else if (transform[i].y < 0) {
                return this._180Transform(xOffset, ++yOffset);
            } else if (transform[i].y >= this.rows) {
                return this._180Transform(xOffset, --yOffset);
            }
        }

        return transform;
    }

    /**
     * Rotate piece to 270
     * @param xOffset
     * @param yOffset
     */
    private _270Transform(
        xOffset?: number,
        yOffset?: number
    ): Array<ICoordinate> {
        xOffset = xOffset ? xOffset : 0;
        yOffset = yOffset ? yOffset : 0;

        const transform: Array<ICoordinate> = [
            {
                x: this.position[0].x - 2 + xOffset,
                y: this.position[0].y + yOffset,
            },
            {
                x: this.position[1].x - 1 + xOffset,
                y: this.position[1].y - 1 + yOffset,
            },
            {
                x: this.position[2].x + xOffset,
                y: this.position[2].y - 2 + yOffset,
            },
            {
                x: this.position[3].x + 1 + xOffset,
                y: this.position[3].y - 1 + yOffset,
            },
        ];

        for (let i: number = 0; i < transform.length; i++) {
            if (transform[i].x < 0) {
                return this._270Transform(++xOffset, yOffset);
            } else if (transform[i].x >= this.cols) {
                return this._270Transform(--xOffset, yOffset);
            } else if (transform[i].y < 0) {
                return this._270Transform(xOffset, ++yOffset);
            } else if (transform[i].y >= this.rows) {
                return this._270Transform(xOffset, --yOffset);
            }
        }

        return transform;
    }
}
