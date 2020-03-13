/**
 * Tetris
 *
 * This is the main Tetris class. It connects the main
 * components, GameEngine, UIEngine, and the EventBus.
 */
import { EventBus } from "./EventBus";
import GameEngine from "./GameEngine";
import UIEngine from "./UIEngine";

export default class Tetris {
    eventBus: EventBus;
    gameEngine: GameEngine;
    uiEngine: UIEngine;

    constructor(rootElement: Element, statsCallback: Function) {
        if (!rootElement) {
            throw new Error("[tetris-ts] No DOM Element provided.");
        }

        // Get singleton instance of EventBus
        this.eventBus = EventBus.getInstance();

        this.gameEngine = new GameEngine(statsCallback);
        this.uiEngine = new UIEngine(rootElement);

        // Start GameEngine and UIEngine initialization
        this.eventBus.publish({ event: "INIT" });
    }
}
