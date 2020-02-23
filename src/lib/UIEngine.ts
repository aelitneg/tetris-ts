import EventBus from "./EventBus";
import { GAME_COLS, GAME_ROWS } from "./Config";
import GamePiece from "./GamePiece"; // eslint-disable-line no-unused-vars
import "./styles.scss";

export default class UIEngine {
    eventBus: EventBus;

    rootElement: Element;
    uiElements: { [key: string]: Element };

    constructor(rootElement: Element) {
        console.log(
            `[tetris-ts UIEngine] rootElement dimensions ${rootElement.clientWidth}x${rootElement.clientHeight}`
        );

        this.rootElement = rootElement;

        this.eventBus = EventBus.getInstance();

        this.uiElements = {};

        this.createInputListeners();
        this.setupEventHandlers();
    }

    /**
     * Build the Foundation UI Elements
     */
    initUI() {
        this.createMainContainer();

        this.createGamePanel();

        this.createGameBoard();

        this.createGameBoardSpaces();

        this.eventBus.publish("UI_READY");
    }

    /**
     * Add Key Listeners and Bind to Handlers
     */
    createInputListeners() {
        document.addEventListener("keydown", e => {
            switch (e.code) {
                case "ArrowLeft":
                    this.eventBus.publish("INPUT_LEFT");
                    break;
                case "ArrowRight":
                    this.eventBus.publish("INPUT_RIGHT");
                    break;
                case "ArrowDown":
                    this.eventBus.publish("INPUT_DOWN");
                    break;
                case "ArrowUp":
                    this.eventBus.publish("INPUT_UP");
                    break;
            }
        });
    }

    /**
     * Setup Event Handlers for EventBus Events
     */
    setupEventHandlers() {
        this.eventBus.subscribe("INIT", this.initUI.bind(this));

        this.eventBus.subscribe("DRAW_ACTIVE", this.drawGamePiece.bind(this));

        this.eventBus.subscribe("ERASE_ACTIVE", this.eraseGamePiece.bind(this));

        this.eventBus.subscribe("REMOVE_ROWS", this.completeRow.bind(this));
    }

    /**
     * Remove rows from  game board
     * @param rows row indexes to remove
     */
    completeRow(rows: Array<number>) {
        rows.forEach(row => {
            this.uiElements.gameBoard.children[row].remove();
            this.drawRow();
        });
    }

    /**
     * Create Main Container
     */
    createMainContainer() {
        const container = document.createElement("div");
        container.classList.add("container");

        this.uiElements.container = container;

        this.rootElement.appendChild(this.uiElements.container);
    }

    /**
     * Create Container for Game Board
     */
    createGamePanel() {
        const gamePanel = document.createElement("div");
        gamePanel.classList.add("panel");
        gamePanel.classList.add("game-panel");

        this.uiElements.gamePanel = gamePanel;
        this.uiElements.container.appendChild(this.uiElements.gamePanel);
    }

    /**
     * Create Game Board
     */
    createGameBoard() {
        const gameBoard = document.createElement("div");
        gameBoard.classList.add("game-board");

        this.uiElements.gameBoard = gameBoard;

        this.uiElements.gamePanel.appendChild(this.uiElements.gameBoard);
    }

    /**
     * Draw Spaces on Game Board
     */
    createGameBoardSpaces() {
        for (let r = 0; r < GAME_ROWS; r++) {
            const row = document.createElement("div");
            row.classList.add("game-row");
            row.style.cssText = `height: ${this.uiElements.gameBoard
                .clientWidth / GAME_COLS}px;`;

            for (let c = 0; c < GAME_COLS; c++) {
                const space = document.createElement("div");
                space.classList.add("game-space");
                row.appendChild(space);
            }

            this.uiElements.gameBoard.appendChild(row);
        }
    }

    /**
     * Draw a game piece on the game board
     * @param gamePiece
     */
    drawGamePiece(gamePiece: GamePiece) {
        gamePiece.position.forEach(piece => {
            this.uiElements.gameBoard.children[piece.y].children[
                piece.x
            ].classList.add("game-piece");
        });
    }

    /**
     * Remove a game piece from the game board
     * @param gamePiece
     */
    eraseGamePiece(gamePiece: GamePiece) {
        gamePiece.position.forEach(piece => {
            this.uiElements.gameBoard.children[piece.y].children[
                piece.x
            ].classList.remove("game-piece");
        });
    }

    /**
     * Draw a row on the game board
     */
    drawRow() {
        const row = document.createElement("div");
        row.classList.add("game-row");
        row.style.cssText = `height: ${this.uiElements.gameBoard.clientWidth /
            GAME_COLS}px;`;

        for (let c = 0; c < GAME_COLS; c++) {
            const space = document.createElement("div");
            space.classList.add("game-space");
            row.appendChild(space);
        }

        this.uiElements.gameBoard.insertBefore(
            row,
            this.uiElements.gameBoard.children[0]
        );
    }
}
