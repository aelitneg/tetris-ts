import EventBus from "./EventBus";
import GameEngine from "./GameEngine";
import UIEngine from "./UIEngine";

export default class Tetris {
    eventBus: EventBus;
    gameEngine: GameEngine;
    uiEngine: UIEngine;

    constructor(rootElement: Element) {
        if (!rootElement) {
            throw new Error("Tetris - constructor No DOM Element provided.");
        }

        this.eventBus = EventBus.getInstance();

        this.gameEngine = new GameEngine();
        this.uiEngine = new UIEngine(rootElement);

        this.setupEventHandlers();

        this.eventBus.publish("INIT");
    }

    setupEventHandlers() {
        this.eventBus.subscribe("UI_READY", this.play.bind(this));
    }

    play() {
        this.eventBus.publish("PLAY");
    }
}
