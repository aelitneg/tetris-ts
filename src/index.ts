import Tetris from "./lib/index";

export function play(el: Element, callback: Function): void {
    try {
        new Tetris(el, callback);
    } catch (error) {
        console.error("[tetris-ts]", error);
    }
}
