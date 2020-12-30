/**
 * GameEngine
 *
 * This class contains the logic for the game. It maintains
 * the game state (including the map of pieces), validates movements,
 * and dispatches events to the UIEngine.
 */
import { Options } from "../../config";
import { Coordinate } from "../GamePiece";
import GamePiece from "../GamePiece/GamePiece";
export default class GameEngine {
    private statsCallback;
    private stateMap;
    private eventBus;
    private activePiece;
    private nextPiece;
    private gameState;
    private points;
    private lineCount;
    private level;
    private frameConst;
    private linesPerLevel;
    constructor(statsCallback: Function, options: Options);
    /**
     * Parse and set user options
     * @param options User supplied options
     */
    parseOptions(options: Options): void;
    /**
     * Subscribe to EventBus events and setup handlers
     */
    subscribeToEvents(): void;
    /**
     * Initialize the stateMap to bounds
     */
    initStateMap(): void;
    /**
     * Ready the GameEngine for play
     */
    resetGame(): void;
    startGame(): void;
    togglePauseGame(): void;
    endGame(): void;
    /**
     * Main game loop. This method controls the automatic falling
     * of pieces, when to generate new game pieces, and when to
     * clear completed rows.
     */
    run(): void;
    /**
     * Generate game pieces
     */
    generateGamePiece(): void;
    /**
     * Check if coordinates are already occupied
     * @param gamePiece
     */
    validateGamePiece(position: Array<Coordinate>): boolean;
    /**
     * Check for rows that are complete
     */
    checkCompleteRows(): void;
    /**
     * Add a GamePiece to the stateMap
     * @param gamePiece GamePiece
     */
    addToStateMap(gamePiece: GamePiece): void;
    /**
     * Remove a GamePiece from the stateMap
     * @param gamePiece GamePiece
     */
    removeFromStateMap(gamePiece: GamePiece): void;
    /**
     * Move activePiece to the left
     */
    moveLeft(): void;
    /**
     * Move activePiece to the right
     */
    moveRight(): void;
    /**
     * Move activePice down
     */
    moveDown(): void;
    /**
     * Move active piece to bottom of current columns
     */
    drop(): void;
    /**
     * Recursively find drop transform by down transforms
     */
    _getDropTransform(): void;
    /**
     * Check if a transform removes lock for piece
     */
    lockCheck(): void;
    /**
     * Transform (rotate) a gamePiece
     */
    transform(): void;
    /**
     * Check if all coordinates in a transform are valid
     * @param transform New position
     */
    validateTransform(transform: Array<Coordinate>): boolean;
    /**
     * Check if coordinate is valid according to bounds and game rules
     * @param c Coordinate
     */
    validateCoordinateTransform(c: Coordinate): boolean;
    /**
     * Check if a coordinate is part of the activePiece
     * @param c Coordinate
     */
    isActivePiece(c: Coordinate): boolean;
    /**
     * Calculate the duration of a game cycle, or
     * the time between automatic down moves. The algorithim
     * starts out a 48 frames per cycle and steps down as the level
     * increases.
     */
    getTimeout(): number;
    calculateRowPoints(rowCount: number): void;
}
