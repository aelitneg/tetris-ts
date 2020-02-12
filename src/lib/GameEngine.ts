import { GAME_COLS, GAME_ROWS } from "./Config";
import GamePiece from "./GamePiece";
import EventBus from "./EventBus";
import ICoordinate from "./ICoordinate"; // eslint-disable-line no-unused-vars

export default class GameEngine {
    stateMap: boolean[][];
    eventBus: EventBus;
    gamePieces: Array<GamePiece>;
    activePiece: GamePiece;

    constructor() {
        this.initStateMap();

        this.eventBus = EventBus.getInstance();

        this.subscribeToEvents();
    }

    /**
     * Initialize the stateMap to bounds
     */
    initStateMap() {
        this.stateMap = [];

        for (let i: number = 0; i < GAME_ROWS; i++) {
            this.stateMap[i] = [];
            for (let j: number = 0; j < GAME_COLS; j++) {
                this.stateMap[i][j] = false;
            }
        }
    }

    /**
     * Subscribe to EventBus events and setup handlers
     */
    subscribeToEvents() {
        this.eventBus.subscribe("PLAY", this.startGame.bind(this));

        this.eventBus.subscribe("INPUT_LEFT", this.moveLeft.bind(this));

        this.eventBus.subscribe("INPUT_RIGHT", this.moveRight.bind(this));

        this.eventBus.subscribe("INPUT_DOWN", this.moveDown.bind(this));

        this.eventBus.subscribe("INPUT_UP", this.transform.bind(this));
    }

    /**
     * Start the game
     */
    startGame() {
        console.log("[tetris-ts GameEngine] Starting Game");
        this.generateGamePiece();
    }

    /**
     * Generate a new GamePiece
     */
    generateGamePiece() {
        const gamePiece = new GamePiece([
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 },
            { x: 3, y: 0 },
        ]);

        this.activePiece = gamePiece;

        this.addToStateMap(this.activePiece);

        this.eventBus.publish("DRAW_ACTIVE", this.activePiece);
    }

    /**
     * Add a GamePiece to the stateMap
     * @param gamePiece GamePiece
     */
    addToStateMap(gamePiece: GamePiece) {
        gamePiece.position.forEach(p => {
            this.stateMap[p.y][p.x] = true;
        });
    }

    /**
     * Remove a GamePiece from the stateMap
     * @param gamePiece GamePiece
     */
    removeFromStateMap(gamePiece: GamePiece) {
        gamePiece.position.forEach(p => {
            this.stateMap[p.y][p.x] = false;
        });
    }

    /**
     * Move activePiece to the left
     */
    moveLeft() {
        const transform: Array<ICoordinate> = this.activePiece.getLeftTransform();
        if (this.validateTransform(transform)) {
            this.removeFromStateMap(this.activePiece);
            this.eventBus.publish("ERASE_ACTIVE", this.activePiece);

            this.activePiece.position = transform;

            this.addToStateMap(this.activePiece);
            this.eventBus.publish("DRAW_ACTIVE", this.activePiece);
        }
    }

    /**
     * Move activePiece to the right
     */
    moveRight() {
        const transform: Array<ICoordinate> = this.activePiece.getRightTransform();
        if (this.validateTransform(transform)) {
            this.removeFromStateMap(this.activePiece);
            this.eventBus.publish("ERASE_ACTIVE", this.activePiece);

            this.activePiece.position = transform;

            this.addToStateMap(this.activePiece);
            this.eventBus.publish("DRAW_ACTIVE", this.activePiece);
        }
    }

    /**
     * Move activePice down
     */
    moveDown() {
        const transform: Array<ICoordinate> = this.activePiece.getDownTransform();
        if (this.validateTransform(transform)) {
            this.removeFromStateMap(this.activePiece);
            this.eventBus.publish("ERASE_ACTIVE", this.activePiece);

            this.activePiece.position = transform;

            this.addToStateMap(this.activePiece);
            this.eventBus.publish("DRAW_ACTIVE", this.activePiece);
        }
    }

    /**
     * Transform (rotate) a gamePiece
     */
    transform() {
        console.log("GameEngine - transform");
        this.eventBus.publish("TRANSFORM");
    }

    /**
     * Check if all coordinates in a transform are valid
     * @param transform New position
     */
    validateTransform(transform: Array<ICoordinate>) {
        let isValid: boolean = true;

        transform.forEach(p => {
            if (!this.validateCoordinateTransform(p)) {
                isValid = false;
            }
        });
        return isValid;
    }

    /**
     * Check if coordinate is valid according to bounds and game rules
     * @param c Coordinate
     */
    validateCoordinateTransform(c: ICoordinate) {
        try {
            let isValid: boolean = true;

            // Check if coordinate is occupied by part of activePiece
            if (this.isActivePiece(c)) {
                throw true;
            }

            // Check if coordinate is out of bounds
            if (c.x < 0 || c.x >= GAME_COLS || c.y < 0 || c.y >= GAME_ROWS) {
                throw false;
            }

            // Check stateMap for existing pieces
            for (let i: number = 0; i < GAME_ROWS; i++) {
                for (let j: number = 0; j < GAME_COLS; j++) {
                    if (this.stateMap[i][j]) {
                        // Check if position on stateMap is part of activePiece
                        if (this.isActivePiece({ x: j, y: i })) {
                            throw true;
                        }

                        throw false;
                    }
                }
            }
            return isValid;
        } catch (result) {
            return result;
        }
    }

    /**
     * Check if a coordinate is part of the activePiece
     * @param c Coordinate
     */
    isActivePiece(c: ICoordinate) {
        try {
            this.activePiece.position.forEach(p => {
                if (c.x == p.x && c.y == p.y) {
                    throw true;
                }
            });

            return false;
        } catch (result) {
            return result;
        }
    }
}
