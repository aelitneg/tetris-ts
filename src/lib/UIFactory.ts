import GamePiece from "./GamePiece";

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

    static drawGamePiece(gameBoard: Element, gamePiece: GamePiece) {
        console.log("[tetris-ts UIFactory] drawGamePiece", gamePiece);

        gamePiece.position.forEach(piece => {
            console.log(gameBoard.children[piece.y].children[piece.x]);
            gameBoard.children[piece.y].children[piece.x].classList.add(
                "game-piece"
            );
        });
    }
}
