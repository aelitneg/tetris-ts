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
import { EventBus } from "../EventBus";
import Render from "./Render";
import "../styles.scss";
export default class UIEngine {
    eventBus: EventBus;
    render: Render;
    rootElement: Element;
    uiElements: {
        [key: string]: Element;
    };
    gameState: GameState;
    /**
     * Constructor
     * @param rootElement DOM element which all other elements will be built from
     */
    constructor(rootElement: Element);
    /**
     * Setup event listeners for key presses
     *
     * Using keydown lets us take advantage of the
     * repeat key when a key is held down.
     */
    createInputListeners(): void;
    /**
     * Setup Event Handlers for EventBus Events
     */
    setupEventHandlers(): void;
    playClickHandler(): void;
    inputSpaceHandler(): void;
    createMainMenu(): void;
    createGameBoard(): void;
    resetUI(): void;
    togglePause(): void;
}
