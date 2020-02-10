import UIEngine from "./UIEngine";

export default class Tetris {
    uiEngine: UIEngine;

    constructor(rootElement: Element) {
        if (!rootElement) {
            throw new Error("Tetris - constructor No DOM Element provided.");
        }

        this.uiEngine = new UIEngine(rootElement);

        this.uiEngine.initUI();

        this.uiEngine.run();
    }
}
