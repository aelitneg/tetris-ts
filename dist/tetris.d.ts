/**
 * Tetris
 *
 * This is the main Tetris class. It connects the main
 * components, GameEngine, UIEngine, and the EventBus.
 *
 * TODO: It appears that the Typescript compiler, when
 * invoked by Webpack, generates an empty Typescript
 * declaration file when using module.exports.
 *
 * The workaround for this issue is to temporarilly
 * change index.ts to an export default, build to
 * generate this file - rename it to tetris.d.ts,
 * and change it back to module.exports again to
 * support require() and import with working
 * Intellisense.
 */
import { EventBus } from "./lib/EventBus";
import GameEngine from "./lib/GameEngine";
import UIEngine from "./lib/UIEngine";
import { Options } from "./config";
export default class Tetris {
    eventBus: EventBus;
    gameEngine: GameEngine;
    uiEngine: UIEngine;
    constructor(
        rootElement: Element,
        statsCallback: Function,
        options?: Options
    );
}
