import { GAME_COLS, GAME_ROWS } from "./Config";
import EventBus from "./EventBus";
import GamePiece from "./GamePiece"; // eslint-disable-line no-unused-vars
import UIFactory from "./UIFactory";
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

        this.eventBus.publish("UI_READY");
    }

    /**
     * Add Key Listeners and Bind to Handlers
     */
    createInputListeners() {
        document.addEventListener("keyup", e => {
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

        this.eventBus.subscribe("DRAW_ACTIVE", this.drawActivePiece.bind(this));

        this.eventBus.subscribe(
            "ERASE_ACTIVE",
            this.eraseActivePiece.bind(this)
        );
    }

    /**
     * Draw the active game piece
     */
    drawActivePiece(gamePiece: GamePiece) {
        UIFactory.drawGamePiece(this.uiElements["gameBoard"], gamePiece);
    }

    /**
     * Erase active game piece
     */
    eraseActivePiece(gamePiece: GamePiece) {
        UIFactory.eraseGamePiece(this.uiElements["gameBoard"], gamePiece);
    }
}
