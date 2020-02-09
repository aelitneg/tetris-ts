import Tetris from "./lib/index";

export function play(el: Element) {
    try {
        new Tetris(el);
    } catch (error) {
        console.error("[tetris-ts]", error);
    }
}
