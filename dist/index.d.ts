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
declare class Tetris {
    eventBus: EventBus;
    gameEngine: GameEngine;
    uiEngine: UIEngine;
    constructor(rootElement: Element, statsCallback: Function, options?: Options);
}
export default Tetris;
