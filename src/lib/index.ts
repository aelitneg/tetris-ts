import { EventBus } from "./EventBus";
import GameEngine from "./GameEngine";
import UIEngine from "./UIEngine";

export default class Tetris {
    eventBus: EventBus;
    gameEngine: GameEngine;
    uiEngine: UIEngine;

    constructor(rootElement: Element, statsCallback: Function) {
        if (!rootElement) {
            throw new Error("Tetris - constructor No DOM Element provided.");
        }

        this.eventBus = EventBus.getInstance();

        this.gameEngine = new GameEngine(statsCallback);
        this.uiEngine = new UIEngine(rootElement);

        this.eventBus.publish({ event: "INIT" });
    }
}
