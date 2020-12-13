/**
 * Tetris
 *
 * This is the main Tetris class. It connects the main
 * components, GameEngine, UIEngine, and the EventBus.
 */
import { EventBus } from "./lib/EventBus";
import GameEngine from "./lib/GameEngine";
import UIEngine from "./lib/UIEngine";
import { Options } from "./config";

class Tetris {
    eventBus: EventBus;
    gameEngine: GameEngine;
    uiEngine: UIEngine;

    constructor(
        rootElement: Element,
        statsCallback: Function,
        options?: Options
    ) {
        if (!rootElement) {
            throw new Error("[tetris-ts] No DOM Element provided.");
        }

        // Get singleton instance of EventBus
        this.eventBus = EventBus.getInstance();

        this.gameEngine = new GameEngine(statsCallback, options);
        this.uiEngine = new UIEngine(rootElement);

        // Start GameEngine and UIEngine initialization
        this.eventBus.publish({ event: "INIT" });
    }
}

export default Tetris;
