/**
 * UIEngine
 *
 * This class contains the logic for the UI. It handles
 * user input and dispatches events to the EventBus for the
 * GameEngine. It also makes calls to the Rener class to
 * manipulate the DOM.
 *
 * The UIEngine stores references to the DOM objects in
 * uiElements. This is an object where each key is the friendly
 * name of the DOM object which is referenced in the value.
 */
import { GameState } from "../GameState";
import { EventBus, GamePieceEvent, RowEvent, StatsEvent } from "../EventBus";
import Render from "./Render";
import "../styles.scss";

export default class UIEngine {
    eventBus: EventBus;
    render: Render;
    rootElement: Element;
    uiElements: { [key: string]: Element };
    gameState: GameState;

    /**
     * Constructor
     * @param rootElement DOM element which all other elements will be built from
     */
    constructor(rootElement: Element) {
        console.log(
            `[tetris-ts] rootElement dimensions ${rootElement.clientWidth}x${rootElement.clientHeight}`
        );

        this.rootElement = rootElement;

        this.uiElements = {};
        this.render = new Render(this.rootElement, this.uiElements);

        this.eventBus = EventBus.getInstance();
        this.createInputListeners();
        this.setupEventHandlers();

        this.gameState = GameState.INIT;
    }

    /**
     * Setup event listeners for key presses
     *
     * Using keydown lets us take advantage of the
     * repeat key when a key is held down.
     */
    createInputListeners(): void {
        document.addEventListener("keydown", (e) => {
            switch (e.code) {
                case "ArrowLeft":
                    e.preventDefault();
                    this.eventBus.publish({ event: "INPUT_LEFT" });
                    break;
                case "ArrowRight":
                    e.preventDefault();
                    this.eventBus.publish({ event: "INPUT_RIGHT" });
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    this.eventBus.publish({ event: "INPUT_DOWN" });
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    this.eventBus.publish({ event: "INPUT_UP" });
                    break;
                case "Space":
                    e.preventDefault();
                    this.eventBus.publish({ event: "INPUT_SPACE" });
                    break;
                case "Escape":
                    e.preventDefault();
                    this.eventBus.publish({ event: "INPUT_ESC" });
                    break;
            }
        });
    }

    /**
     * Setup Event Handlers for EventBus Events
     */
    setupEventHandlers(): void {
        this.eventBus.subscribe("INIT", () => {
            this.createMainMenu();
        });

        this.eventBus.subscribe("PLAY_CLICK", () => {
            this.playClickHandler();
        });

        this.eventBus.subscribe("DRAW_ACTIVE", (event: GamePieceEvent) => {
            if (
                this.gameState === GameState.PLAYING ||
                this.gameState === GameState.PAUSED
            ) {
                this.render.drawGamePiece(event.gamePiece);
            }
        });

        this.eventBus.subscribe("ERASE_ACTIVE", (event: GamePieceEvent) => {
            if (
                this.gameState === GameState.PLAYING ||
                this.gameState === GameState.PAUSED
            ) {
                this.render.eraseGamePiece(event.gamePiece);
            }
        });

        this.eventBus.subscribe("REMOVE_ROWS", (event: RowEvent) => {
            if (
                this.gameState === GameState.PLAYING ||
                this.gameState === GameState.PAUSED
            ) {
                this.render.removeRow(event.rows);
            }
        });

        this.eventBus.subscribe("UPDATE_POINTS", (event: StatsEvent) => {
            this.render.updatePoints(event.value);
        });

        this.eventBus.subscribe("UPDATE_LINES", (event: StatsEvent) => {
            this.render.updateLines(event.value);
        });

        this.eventBus.subscribe("UPDATE_LEVEL", (event: StatsEvent) => {
            this.render.updateLevel(event.value);
        });

        this.eventBus.subscribe("DRAW_NEXT", (event: GamePieceEvent) => {
            if (
                this.gameState === GameState.PLAYING ||
                this.gameState === GameState.PAUSED
            ) {
                this.render.drawNextPiece(event.gamePiece);
            }
        });

        this.eventBus.subscribe(
            "INPUT_SPACE",
            this.inputSpaceHandler.bind(this)
        );

        this.eventBus.subscribe("INPUT_ESC", (): void => {
            this.resetUI();
        });
    }

    playClickHandler(): void {
        this.gameState = GameState.PLAYING;
        this.createGameBoard();
    }

    inputSpaceHandler(): void {
        switch (this.gameState) {
            case GameState.PLAYING:
                this.togglePause();
                this.gameState = GameState.PAUSED;
                break;
            case GameState.PAUSED:
                this.togglePause();
                this.gameState = GameState.PLAYING;
                break;
        }
    }

    createMainMenu(): void {
        this.render.createMainContainer();

        this.render.createMenuPanel(() => {
            this.eventBus.publish({ event: "PLAY_CLICK" });
        });

        this.eventBus.publish({ event: "UI_READY" });
    }

    createGameBoard(): void {
        this.uiElements.container.removeChild(this.uiElements.mainPanel);

        this.render.createGamePanel();

        this.eventBus.publish({ event: "PLAY" });
    }

    resetUI(): void {
        this.gameState = GameState.STOPPED;

        this.rootElement.innerHTML = "";

        Object.keys(this.uiElements).forEach((key) => {
            delete this.uiElements[key];
        });

        this.createMainMenu();
    }

    togglePause(): void {
        if (this.gameState === GameState.PLAYING) {
            this.uiElements.container.classList.add("paused");
        } else {
            this.uiElements.container.classList.remove("paused");
        }
    }
}
