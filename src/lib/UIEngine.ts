import GamePiece from "./GamePiece";
import UIFactory from "./UIFactory";
import "./styles.scss";

const GAME_COLS: number = 10;
const GAME_ROWS: number = 20;

interface State {
    state: boolean;
}

interface stateRow {
    row: Array<State>;
}

export default class UIEngine {
    rootElement: Element;
    uiElements: { [key: string]: Element };
    gamePieces: Array<GamePiece>;
    activePiece: GamePiece;

    constructor(rootElement: Element) {
        console.log(
            `[tetris-ts UIEngine] ${rootElement.clientWidth}x${rootElement.clientHeight}`
        );

        this.rootElement = rootElement;
        this.uiElements = {};

        this.initListeners();
    }

    /**
     * Build the Foundation UI Elements
     */
    initUI() {
        console.log("tetris-ts UIEngine] initUI()");

        this.uiElements["container"] = UIFactory.createMainContainer();
        this.rootElement.appendChild(this.uiElements["container"]);

        this.uiElements["gamePanel"] = UIFactory.createGamePanel();
        this.uiElements["container"].appendChild(this.uiElements["gamePanel"]);

        this.uiElements["gameBoard"] = UIFactory.createGameBoard();
        this.uiElements["gamePanel"].appendChild(this.uiElements["gameBoard"]);

        UIFactory.createGameBoardSpaces(
            this.uiElements["gameBoard"],
            GAME_ROWS,
            GAME_COLS
        );
    }

    /**
     * Add Key Listeners and Bind to Handlers
     */
    initListeners() {
        document.addEventListener("keyup", e => {
            switch (e.code) {
                case "ArrowUp":
                    console.log("ArrowUp");
                    break;
                case "ArrowDown":
                    console.log("ArrowDown");
                    break;
                case "ArrowLeft":
                    console.log("ArrowLeft");
                    break;
                case "ArrowRight":
                    console.log("ArrowRight");
                    break;
            }
        });
    }

    /**
     * Run the Game
     */
    run() {
        this.generateGamePiece();
    }

    /**
     * Generate a new Game Piece
     */
    generateGamePiece() {
        const gamePiece = new GamePiece([
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 },
            { x: 3, y: 0 },
        ]);

        this.activePiece = gamePiece;
        UIFactory.drawGamePiece(this.uiElements["gameBoard"], this.activePiece);
    }
}
