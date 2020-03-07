import { FRAME_CONST, GAME_COLS, GAME_ROWS } from "../../config";
import { GamePieceType, GameState } from "../enum";

import GamePiece from "../GamePiece";
import BlockType from "../GamePiece/BlockType";
import LineType from "../GamePiece/LineType";
import ZType from "../GamePiece/ZType";
import ZInvType from "../GamePiece/ZInvType";
import TType from "../GamePiece/TType";
import LType from "../GamePiece/LType";
import LInvType from "../GamePiece/LInvType";

import EventBus from "../EventBus";

export default class GameEngine {
    private stateMap: boolean[][];
    private eventBus: EventBus;
    private activePiece: GamePiece;
    private gameState: GameState;
    private points: number;
    private lineCount: number;
    private level: number;

    constructor() {
        this.gameState = GameState.INIT;

        this.initStateMap();

        this.eventBus = EventBus.getInstance();

        this.subscribeToEvents();
    }

    /**
     * Initialize the stateMap to bounds
     */
    initStateMap(): void {
        this.stateMap = [];

        for (let i = 0; i < GAME_ROWS; i++) {
            this.stateMap[i] = [];
            for (let j = 0; j < GAME_COLS; j++) {
                this.stateMap[i][j] = false;
            }
        }
    }

    /**
     * Subscribe to EventBus events and setup handlers
     */
    subscribeToEvents(): void {
        this.eventBus.subscribe("PLAY", this.startGame.bind(this));

        this.eventBus.subscribe("INPUT_LEFT", this.moveLeft.bind(this));

        this.eventBus.subscribe("INPUT_RIGHT", this.moveRight.bind(this));

        this.eventBus.subscribe("INPUT_DOWN", this.moveDown.bind(this));

        this.eventBus.subscribe("INPUT_UP", this.transform.bind(this));

        this.eventBus.subscribe("INPUT_SPACE", this.togglePauseGame.bind(this));
    }

    /**
     * Start the game
     */
    startGame(): void {
        console.log("[tetris-ts GameEngine] Starting Game");
        this.gameState = GameState.PLAYING;

        this.points = 0;
        this.eventBus.publish("UPDATE_POINTS", null, null, 0);

        this.lineCount = 0;
        this.eventBus.publish("UPDATE_LINES", null, null, 0);

        this.level = 0;
        this.eventBus.publish("UPDATE_LEVEL", null, null, 0);

        this.run();
    }

    togglePauseGame(): void {
        if (this.gameState === GameState.PLAYING) {
            this.gameState = GameState.PAUSED;
        } else if (this.gameState === GameState.PAUSED) {
            this.gameState = GameState.PLAYING;
            this.run();
        }
    }

    /**
     * Main loop. Move GamePiece down and generate
     * new ones.
     */
    run(): void {
        if (this.gameState == GameState.PLAYING) {
            if (
                this.activePiece &&
                this.validateTransform(this.activePiece.getDownTransform())
            ) {
                this.moveDown();

                setTimeout(() => {
                    this.run();
                }, this.getTimeout());
            } else if (this.activePiece) {
                this.activePiece.locking = true;

                setTimeout(() => {
                    if (this.activePiece.locking) {
                        this.activePiece = null;
                        this.checkCompleteRows();
                        this.generateGamePiece();
                    }

                    setTimeout(() => {
                        this.run();
                    }, this.getTimeout());
                }, this.getTimeout());
            } else {
                this.generateGamePiece();

                setTimeout(() => {
                    this.run();
                }, this.getTimeout());
            }
        } else if (this.gameState !== GameState.PAUSED) {
            this.activePiece = null;

            console.log("GAME OVER");
            console.log("POINTS:", this.points);
            console.log("LINES:", this.lineCount);
            console.log("LEVEL:", this.level);
        }
    }

    /**
     * Calculate the timeout between drops
     */
    getTimeout(): number {
        if (this.level < 10) {
            return ((48 - 5 * this.level) / FRAME_CONST) * 1000;
        } else if (this.level >= 10 && this.level < 13) {
            return (5 / FRAME_CONST) * 1000;
        } else if (this.level >= 13 && this.level < 16) {
            return (4 / FRAME_CONST) * 1000;
        } else if (this.level >= 16 && this.level < 19) {
            return (3 / FRAME_CONST) * 1000;
        } else if (this.level >= 19 && this.level < 29) {
            return (2 / FRAME_CONST) * 1000;
        } else {
            return (1 / FRAME_CONST) * 1000;
        }
    }

    /**
     * Generate a new GamePiece
     */
    generateGamePiece(): void {
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

        if (!this.validateGamePiece(gamePiece.position)) {
            this.gameState = GameState.STOPPED;
        }

        this.activePiece = gamePiece;
        this.addToStateMap(this.activePiece);
        this.eventBus.publish("DRAW_ACTIVE", this.activePiece);
    }

    /**
     * Check if coordinates are already occupied
     * @param gamePiece
     */
    validateGamePiece(position: Array<Coordinate>): boolean {
        let isValid = true;
        position.forEach(p => {
            if (this.stateMap[p.y][p.x]) {
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Check for rows that are complete
     */
    checkCompleteRows(): void {
        const completeRows: Array<number> = [];

        for (let i = 0; i < GAME_ROWS; i++) {
            let sum = 0;
            for (let j = 0; j < GAME_COLS; j++) {
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
                for (let i = 0; i < GAME_COLS; i++) {
                    row.push(false);
                }
                this.stateMap.unshift(row);
            });

            this.calculateRowPoints(completeRows.length);

            this.eventBus.publish("REMOVE_ROWS", null, completeRows);
        }
    }

    /**
     * Add a GamePiece to the stateMap
     * @param gamePiece GamePiece
     */
    addToStateMap(gamePiece: GamePiece): void {
        gamePiece.position.forEach(p => {
            this.stateMap[p.y][p.x] = true;
        });
    }

    /**
     * Remove a GamePiece from the stateMap
     * @param gamePiece GamePiece
     */
    removeFromStateMap(gamePiece: GamePiece): void {
        gamePiece.position.forEach(p => {
            this.stateMap[p.y][p.x] = false;
        });
    }

    /**
     * Move activePiece to the left
     */
    moveLeft(): void {
        if (this.gameState != GameState.PLAYING) {
            return;
        }

        const transform: Array<Coordinate> = this.activePiece.getLeftTransform();
        if (this.validateTransform(transform)) {
            this.removeFromStateMap(this.activePiece);
            this.eventBus.publish("ERASE_ACTIVE", this.activePiece);

            this.activePiece.position = transform;

            this.addToStateMap(this.activePiece);
            this.eventBus.publish("DRAW_ACTIVE", this.activePiece);

            if (this.activePiece.locking) {
                this.lockCheck();
            }
        }
    }

    /**
     * Move activePiece to the right
     */
    moveRight(): void {
        if (this.gameState != GameState.PLAYING) {
            return;
        }

        const transform: Array<Coordinate> = this.activePiece.getRightTransform();
        if (this.validateTransform(transform)) {
            this.removeFromStateMap(this.activePiece);
            this.eventBus.publish("ERASE_ACTIVE", this.activePiece);

            this.activePiece.position = transform;

            this.addToStateMap(this.activePiece);
            this.eventBus.publish("DRAW_ACTIVE", this.activePiece);

            if (this.activePiece.locking) {
                this.lockCheck();
            }
        }
    }

    /**
     * Move activePice down
     */
    moveDown(): void {
        if (this.gameState != GameState.PLAYING) {
            return;
        }

        const transform: Array<Coordinate> = this.activePiece.getDownTransform();
        if (this.validateTransform(transform)) {
            this.removeFromStateMap(this.activePiece);
            this.eventBus.publish("ERASE_ACTIVE", this.activePiece);

            this.activePiece.position = transform;

            this.addToStateMap(this.activePiece);
            this.eventBus.publish("DRAW_ACTIVE", this.activePiece);

            if (this.activePiece.locking) {
                this.lockCheck();
            }
        }
    }

    /**
     * Check if a transform removes lock for piece
     */
    lockCheck(): void {
        if (this.validateTransform(this.activePiece.getDownTransform())) {
            this.activePiece.locking = false;
        }
    }

    /**
     * Transform (rotate) a gamePiece
     */
    transform(): void {
        if (this.gameState != GameState.PLAYING) {
            return;
        }

        const transform: Array<Coordinate> = this.activePiece.getTransform();

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
    validateTransform(transform: Array<Coordinate>): boolean {
        let isValid = true;

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
    validateCoordinateTransform(c: Coordinate): boolean {
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
    isActivePiece(c: Coordinate): boolean {
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

    calculateRowPoints(rowCount: number): void {
        let rowPoints: number;
        switch (rowCount) {
            case 1:
                rowPoints = 40;
                break;
            case 2:
                rowPoints = 100;
                break;
            case 3:
                rowPoints = 300;
                break;
            case 4:
                rowPoints = 1200;
                break;
        }

        this.points += rowPoints * (this.level + 1);
        this.eventBus.publish("UPDATE_POINTS", null, null, this.points);

        this.lineCount = this.lineCount + rowCount;
        this.eventBus.publish("UPDATE_LINES", null, null, this.lineCount);

        if (this.lineCount >= (this.level + 1) * 10) {
            this.level++;
            this.eventBus.publish("UPDATE_LEVEL", null, null, this.level);
        }
    }
}
