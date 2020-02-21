import { GAME_COLS } from "./Config";
import GamePiece from "./GamePiece"; // eslint-disable-line no-unused-vars

export default class UIFactory {
    /**
     * Create Main Container
     */
    static createMainContainer() {
        const container = document.createElement("div");
        container.classList.add("container");

        return container;
    }

    /**
     * Create Container for Game Board
     */
    static createGamePanel() {
        const gamePanel = document.createElement("div");
        gamePanel.classList.add("panel");
        gamePanel.classList.add("game-panel");

        return gamePanel;
    }

    /**
     * Create Game Board
     */
    static createGameBoard() {
        const gameBoard = document.createElement("div");
        gameBoard.classList.add("game-board");

        return gameBoard;
    }

    /**
     * Draw Spaces on Game Board
     *
     * @param gameBoard Game Board Element
     * @param rows Number of Rows
     * @param cols Number of Columns
     */
    static createGameBoardSpaces(
        gameBoard: Element,
        rows: number,
        cols: number
    ) {
        for (let r = 0; r < rows; r++) {
            const row = document.createElement("div");
            row.classList.add("game-row");
            row.style.cssText = `height: ${gameBoard.clientWidth / cols}px;`;

            for (let c = 0; c < cols; c++) {
                const space = document.createElement("div");
                space.classList.add("game-space");
                row.appendChild(space);
            }

            gameBoard.appendChild(row);
        }
    }

    /**
     * Draw a game piece on the game board
     * @param gameBoard
     * @param gamePiece
     */
    static drawGamePiece(gameBoard: Element, gamePiece: GamePiece) {
        gamePiece.position.forEach(piece => {
            gameBoard.children[piece.y].children[piece.x].classList.add(
                "game-piece"
            );
        });
    }

    /**
     * Remove a game piece from the game board
     * @param gameBoard
     * @param gamePiece
     */
    static eraseGamePiece(gameBoard: Element, gamePiece: GamePiece) {
        gamePiece.position.forEach(piece => {
            gameBoard.children[piece.y].children[piece.x].classList.remove(
                "game-piece"
            );
        });
    }

    /**
     * Draw a row on the game board
     * @param gameBoard
     * @param index index to insert before
     */
    static drawRow(gameBoard: Element, index: number) {
        const row = document.createElement("div");
        row.classList.add("game-row");
        row.style.cssText = `height: ${gameBoard.clientWidth / GAME_COLS}px;`;

        for (let c = 0; c < GAME_COLS; c++) {
            const space = document.createElement("div");
            space.classList.add("game-space");
            row.appendChild(space);
        }

        gameBoard.insertBefore(row, gameBoard.children[index]);
    }

    /**
     * Remove row from game board
     * @param gameBoard
     * @param row index of row to remove
     */
    static eraseRow(gameBoard: Element, row: number) {
        gameBoard.children[row].remove();
    }
}
