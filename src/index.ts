import Tetris from "./lib/index";

export function play(el: Element): void {
    try {
        new Tetris(el);
    } catch (error) {
        console.error("[tetris-ts]", error);
    }
}
