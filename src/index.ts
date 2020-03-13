/**
 * tetris-ts
 *
 * Main entry point into the library.
 * This file exposes the play() function which
 * starts the game.
 */
import Tetris from "./lib/index";

/**
 * Start tetris-ts
 * @param el DOM Element to bind to
 * @param callback Callback to receive score data when the game ends
 */
export function play(el: Element, callback: Function): void {
    try {
        new Tetris(el, callback);
    } catch (error) {
        console.error("[tetris-ts]", error);
    }
}
