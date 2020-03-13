/**
 * GameEngine
 *
 * This class contains the logic for the game. It maintains
 * the game state (including the map of pieces), validates movements,
 * and dispatches events to the UIEngine.
 */
import { FRAME_CONST, GAME_COLS, GAME_ROWS } from "../../config";
import { GameState } from "../GameState";

// Types and Wrapper Methods from GamePiece
import { Coordinate, newGamePiece } from "../GamePiece";

// GamePiece Class
import GamePiece from "../GamePiece/GamePiece";

import { EventBus } from "../EventBus";

export default class GameEngine {
    private statsCallback: Function;
    private stateMap: boolean[][];
    private eventBus: EventBus;
    private activePiece: GamePiece;
    private nextPiece: GamePiece;
    private gameState: GameState;
    private points: number;
    private lineCount: number;
    private level: number;

    constructor(statsCallback: Function) {
        this.statsCallback = statsCallback;

        this.eventBus = EventBus.getInstance();
        this.subscribeToEvents();

        this.resetGame();
    }

    /**
     * Subscribe to EventBus events and setup handlers
     */
    subscribeToEvents(): void {
        this.eventBus.subscribe("PLAY", () => {
            this.startGame();
        });

        this.eventBus.subscribe("INPUT_LEFT", () => {
            this.moveLeft();
        });

        this.eventBus.subscribe("INPUT_RIGHT", () => {
            this.moveRight();
        });

        this.eventBus.subscribe("INPUT_DOWN", () => {
            this.moveDown();
        });

        this.eventBus.subscribe("INPUT_UP", () => {
            this.transform();
        });

        this.eventBus.subscribe("INPUT_SPACE", () => {
            this.togglePauseGame();
        });

        this.eventBus.subscribe("INPUT_ESC", () => {
            if (
                this.gameState === GameState.PLAYING ||
                this.gameState === GameState.PAUSED
            ) {
                this.gameState = GameState.STOPPED;
            }
        });
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
     * Ready the GameEngine for play
     */
    resetGame(): void {
        this.initStateMap();

        this.points = 0;
        this.lineCount = 0;
        this.level = 0;

        this.gameState = GameState.INIT;
    }

    startGame(): void {
        console.log("[tetris-ts] Starting Game");
        this.gameState = GameState.PLAYING;

        this.activePiece = null;
        this.nextPiece = null;

        this.points = 0;
        this.eventBus.publishStatsEvent({
            event: "UPDATE_POINTS",
            value: this.points,
        });

        this.lineCount = 0;
        this.eventBus.publishStatsEvent({
            event: "UPDATE_LINES",
            value: this.lineCount,
        });

        this.level = 0;
        this.eventBus.publishStatsEvent({
            event: "UPDATE_LEVEL",
            value: this.level,
        });

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

    endGame(): void {
        this.gameState = GameState.STOPPED;

        this.activePiece = null;
        this.nextPiece = null;

        // Pass score data out of the library
        this.statsCallback({
            points: this.points,
            lines: this.lineCount,
            level: this.level,
        });

        this.resetGame();
    }

    /**
     * Main game loop. This method controls the automatic falling
     * of pieces, when to generate new game pieces, and when to
     * clear completed rows.
     */
    run(): void {
        if (this.gameState == GameState.PLAYING) {
            if (
                this.activePiece &&
                this.validateTransform(this.activePiece.getDownTransform())
            ) {
                // If activePiece can move down...
                this.moveDown();

                // Wait for next cycle to run again
                setTimeout(() => {
                    this.run();
                }, this.getTimeout());
            } else if (this.activePiece) {
                // If activePiece cannot move down, set locking state
                this.activePiece.locking = true;

                // Wait one cycle for 'slide' moves
                setTimeout(() => {
                    // Check if 'slide' move removed the piece from lock
                    if (this.activePiece.locking) {
                        this.activePiece = null;
                        this.checkCompleteRows();
                        this.generateGamePiece();
                    }

                    // Wait for next cycle to run again
                    setTimeout(() => {
                        this.run();
                    }, this.getTimeout());
                }, this.getTimeout());
            } else {
                // If no activePiece, make a new one
                this.generateGamePiece();

                // Wait for next cycle to run again
                setTimeout(() => {
                    this.run();
                }, this.getTimeout());
            }
        } else if (this.gameState !== GameState.PAUSED) {
            // If not playing or paused, end the game

            this.endGame();
        }
    }

    /**
     * Generate game pieces
     */
    generateGamePiece(): void {
        if (!this.nextPiece) {
            this.nextPiece = newGamePiece();
        }

        if (!this.validateGamePiece(this.nextPiece.position)) {
            this.gameState = GameState.STOPPED;
        }

        this.activePiece = this.nextPiece;
        this.addToStateMap(this.activePiece);
        this.eventBus.publishGamePieceEvent({
            event: "DRAW_ACTIVE",
            gamePiece: this.activePiece,
        });

        this.nextPiece = newGamePiece();
        this.eventBus.publishGamePieceEvent({
            event: "DRAW_NEXT",
            gamePiece: this.nextPiece,
        });
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

            this.eventBus.publishRowEvent({
                event: "REMOVE_ROWS",
                rows: completeRows,
            });
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
            this.eventBus.publishGamePieceEvent({
                event: "ERASE_ACTIVE",
                gamePiece: this.activePiece,
            });

            this.activePiece.position = transform;

            this.addToStateMap(this.activePiece);
            this.eventBus.publishGamePieceEvent({
                event: "DRAW_ACTIVE",
                gamePiece: this.activePiece,
            });

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
            this.eventBus.publishGamePieceEvent({
                event: "ERASE_ACTIVE",
                gamePiece: this.activePiece,
            });

            this.activePiece.position = transform;

            this.addToStateMap(this.activePiece);
            this.eventBus.publishGamePieceEvent({
                event: "DRAW_ACTIVE",
                gamePiece: this.activePiece,
            });

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
            this.eventBus.publishGamePieceEvent({
                event: "ERASE_ACTIVE",
                gamePiece: this.activePiece,
            });

            this.activePiece.position = transform;

            this.addToStateMap(this.activePiece);
            this.eventBus.publishGamePieceEvent({
                event: "DRAW_ACTIVE",
                gamePiece: this.activePiece,
            });

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
            this.eventBus.publishGamePieceEvent({
                event: "ERASE_ACTIVE",
                gamePiece: this.activePiece,
            });

            this.activePiece.position = transform;

            this.addToStateMap(this.activePiece);
            this.eventBus.publishGamePieceEvent({
                event: "DRAW_ACTIVE",
                gamePiece: this.activePiece,
            });
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

    /**
     * Calculate the duration of a game cycle, or
     * the time between automatic down moves. The algorithim
     * starts out a 48 frames per cycle and steps down as the level
     * increases.
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
        this.eventBus.publishStatsEvent({
            event: "UPDATE_POINTS",
            value: this.points,
        });

        this.lineCount = this.lineCount + rowCount;
        this.eventBus.publishStatsEvent({
            event: "UPDATE_LINES",
            value: this.lineCount,
        });

        if (this.lineCount >= (this.level + 1) * 10) {
            this.level++;
            this.eventBus.publishStatsEvent({
                event: "UPDATE_LEVEL",
                value: this.level,
            });
        }
    }
}
