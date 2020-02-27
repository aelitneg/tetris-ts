import { GAME_COLS, GAME_ROWS } from "./Config";

import GamePiece from "./GamePiece"; // eslint-disable-line no-unused-vars
import BlockType from "./GamePieces/BlockType";
import LineType from "./GamePieces/LineType";
import ZType from "./GamePieces/ZType";
import ZInvType from "./GamePieces/ZInvType";
import TType from "./GamePieces/TType";
import LType from "./GamePieces/LType";
import LInvType from "./GamePieces/LInvType";

import EventBus from "./EventBus";
import ICoordinate from "./ICoordinate"; // eslint-disable-line no-unused-vars

enum GamePieceType {
    BLOCK, // eslint-disable-line no-unused-vars
    LINE, // eslint-disable-line no-unused-vars
    Z, // eslint-disable-line no-unused-vars
    Z_INV, // eslint-disable-line no-unused-vars
    T, // eslint-disable-line no-unused-vars
    L, // eslint-disable-line no-unused-vars
    L_INV, // eslint-disable-line no-unused-vars
}

enum GameState {
    INIT, // eslint-disable-line no-unused-vars
    PLAYING, // eslint-disable-line no-unused-vars
    STOPPED, // eslint-disable-line no-unused-vars
}

export default class GameEngine {
    stateMap: boolean[][];
    eventBus: EventBus;
    activePiece: GamePiece;
    gameState: GameState;
    lineCount: number;

    constructor() {
        this.gameState = GameState.INIT;

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
        this.gameState = GameState.PLAYING;

        this.run();
    }

    /**
     * Main loop. Move GamePiece down and generate
     * new ones.
     */
    run() {
        if (this.gameState == GameState.PLAYING) {
            if (!this.activePiece) {
                this.generateGamePiece();
            }

            if (this.validateTransform(this.activePiece.getDownTransform())) {
                setTimeout(() => {
                    this.moveDown();
                    this.run();
                }, 1000);
            } else {
                this.checkCompleteRows();
                this.generateGamePiece();
                this.run();
            }
        }
    }

    /**
     * Generate a new GamePiece
     */
    generateGamePiece() {
        const gamePieceType: GamePieceType = Math.floor(
            Math.random() * Math.floor(7)
        );

        let gamePiece: GamePiece;

        switch (gamePieceType as GamePieceType) {
            case GamePieceType.BLOCK:
                gamePiece = new BlockType();
                break;
            case GamePieceType.LINE:
                gamePiece = new LineType();
                break;
            case GamePieceType.Z:
                gamePiece = new ZType();
                break;
            case GamePieceType.Z_INV:
                gamePiece = new ZInvType();
                break;
            case GamePieceType.T:
                gamePiece = new TType();
                break;
            case GamePieceType.L:
                gamePiece = new LType();
                break;
            case GamePieceType.L_INV:
                gamePiece = new LInvType();
                break;
            default:
                throw Error(
                    `[tetris-ts] Invalid GamePieceType '${gamePieceType}'`
                );
        }

        if (!this.validateTransform(gamePiece.position)) {
            this.gameState = GameState.STOPPED;
            console.log("GAME OVER");
        }

        this.activePiece = gamePiece;
        this.eventBus.publish("DRAW_ACTIVE", this.activePiece);
    }

    /**
     * Check for rows that are complete
     */
    checkCompleteRows() {
        const completeRows: Array<number> = [];

        for (let i: number = 0; i < GAME_ROWS; i++) {
            let sum: number = 0;
            for (let j: number = 0; j < GAME_COLS; j++) {
                if (this.stateMap[i][j]) {
                    sum++;
                }
            }

            if (sum === GAME_COLS) {
                completeRows.push(i);
            }
        }

        if (completeRows.length) {
            completeRows.forEach(i => {
                this.stateMap.splice(i, 1);
                const row: Array<boolean> = [];
                for (let i: number = 0; i < GAME_COLS; i++) {
                    row.push(false);
                }
                this.stateMap.unshift(row);
            });
            this.eventBus.publish("REMOVE_ROWS", null, completeRows);
        }
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
        const transform: Array<ICoordinate> = this.activePiece.getTransform();

        if (this.validateTransform(transform)) {
            this.removeFromStateMap(this.activePiece);
            this.eventBus.publish("ERASE_ACTIVE", this.activePiece);

            this.activePiece.position = transform;

            this.addToStateMap(this.activePiece);
            this.eventBus.publish("DRAW_ACTIVE", this.activePiece);
        }
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
            // Check if coordinate is occupied by part of activePiece
            if (this.isActivePiece(c)) {
                throw true;
            }

            // Check if coordinate is out of bounds
            if (c.x < 0 || c.x >= GAME_COLS || c.y < 0 || c.y >= GAME_ROWS) {
                throw false;
            }

            // Check stateMap for coordinate
            if (this.stateMap[c.y][c.x]) {
                throw false;
            }

            return true;
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
