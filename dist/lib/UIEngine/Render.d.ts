import GamePiece from "../GamePiece/GamePiece";
import { Coordinate, Color } from "../GamePiece";
export default class Render {
    rootElement: Element;
    uiElements: {
        [key: string]: Element;
    };
    constructor(rootElement: Element, uiElements: {
        [key: string]: Element;
    });
    createMainContainer(): void;
    /**
     * Create main menu
     * @param playEvent event fired on play button onclick
     */
    createMenuPanel(playEvent: Function): void;
    createControlTable(): void;
    createGamePanel(): void;
    createStatsPanel(): void;
    createNextPieceContainer(): void;
    createGameBoard(): void;
    createGameBoardSpaces(): void;
    createNextPieceSpaces(rows: number, cols: number): void;
    /**
     * Draw a game piece on the game board
     * @param gamePiece
     */
    drawGamePiece(gamePiece: GamePiece): void;
    /**
     * Remove a game piece from the game board
     * @param gamePiece
     */
    eraseGamePiece(gamePiece: GamePiece): void;
    drawRow(): void;
    /**
     * Remove rows from  game board
     * @param rows row indexes to remove
     */
    removeRow(rows: Array<number>): void;
    drawNextPiece(gamePiece: GamePiece): void;
    setNextPieceActive(position: Array<Coordinate>, color: Color): void;
    updatePoints(points: number): void;
    updateLines(lines: number): void;
    updateLevel(level: number): void;
}
