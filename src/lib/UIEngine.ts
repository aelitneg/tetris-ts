import UIFactory from "./UIFactory";
import "./styles.scss";

const GAME_COLS: number = 10;
const GAME_ROWS: number = 20;

export default class UIEngine {
    rootElement: Element;
    uiElements: { [key: string]: Element };

    constructor(rootElement: Element) {
        console.log(
            `[tetris-ts UIEngine] ${rootElement.clientWidth}x${rootElement.clientHeight}`
        );

        this.rootElement = rootElement;
        this.uiElements = {};
    }

    /**
     * Build the Foundation UI Elements
     */
    initUI() {
        console.log("tetris-ts UIEngine] initUI()");

        this.uiElements["container"] = UIFactory.createMainContainer();
        this.rootElement.appendChild(this.uiElements["container"]);

        this.uiElements["gamePanel"] = UIFactory.createGamePanel();
        this.uiElements["container"].appendChild(this.uiElements["gamePanel"]);

        this.uiElements["gameBoard"] = UIFactory.createGameBoard();
        this.uiElements["gamePanel"].appendChild(this.uiElements["gameBoard"]);

        UIFactory.createGameBoardSpaces(
            this.uiElements["gameBoard"],
            GAME_ROWS,
            GAME_COLS
        );
    }
}
