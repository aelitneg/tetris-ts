import EventBus from "../EventBus";
import { GAME_COLS, GAME_ROWS } from "../../config";
import "../styles.scss";

export default class UIEngine {
    eventBus: EventBus;

    rootElement: Element;
    uiElements: { [key: string]: Element };

    constructor(rootElement: Element) {
        console.log(
            `[tetris-ts UIEngine] rootElement dimensions ${rootElement.clientWidth}x${rootElement.clientHeight}`
        );

        this.rootElement = rootElement;

        this.eventBus = EventBus.getInstance();

        this.uiElements = {};

        this.createInputListeners();
        this.setupEventHandlers();
    }

    /**
     * Build the Foundation UI Elements
     */
    initUI(): void {
        this.createMainContainer();

        this.createMainPanel();

        this.eventBus.publish("UI_READY");
    }

    /**
     * Hide main panel and show gameboard
     */
    initGameBoard(): void {
        this.uiElements.container.removeChild(this.uiElements.mainPanel);

        this.createGamePanel();

        this.createGameBoard();

        this.createGameBoardSpaces();

        this.eventBus.publish("PLAY");
    }

    /**
     * Add Key Listeners and Bind to Handlers
     */
    createInputListeners(): void {
        document.addEventListener("keydown", e => {
            switch (e.code) {
                case "ArrowLeft":
                    this.eventBus.publish("INPUT_LEFT");
                    break;
                case "ArrowRight":
                    this.eventBus.publish("INPUT_RIGHT");
                    break;
                case "ArrowDown":
                    this.eventBus.publish("INPUT_DOWN");
                    break;
                case "ArrowUp":
                    this.eventBus.publish("INPUT_UP");
                    break;
            }
        });
    }

    /**
     * Setup Event Handlers for EventBus Events
     */
    setupEventHandlers(): void {
        this.eventBus.subscribe("INIT", this.initUI.bind(this));

        this.eventBus.subscribe("PLAY_CLICK", this.initGameBoard.bind(this));

        this.eventBus.subscribe("DRAW_ACTIVE", this.drawGamePiece.bind(this));

        this.eventBus.subscribe("ERASE_ACTIVE", this.eraseGamePiece.bind(this));

        this.eventBus.subscribe("REMOVE_ROWS", this.completeRow.bind(this));

        this.eventBus.subscribe("UPDATE_POINTS", this.updatePoints.bind(this));

        this.eventBus.subscribe("UPDATE_LINES", this.updateLines.bind(this));

        this.eventBus.subscribe("UPDATE_LEVEL", this.updateLevel.bind(this));
    }

    /**
     * Remove rows from  game board
     * @param rows row indexes to remove
     */
    completeRow(rows: Array<number>): void {
        rows.forEach(row => {
            this.uiElements.gameBoard.children[row].remove();
            this.drawRow();
        });
    }

    /**
     * Create Main Container
     */
    createMainContainer(): void {
        const container = document.createElement("div");
        container.classList.add("container");

        this.uiElements.container = container;

        this.rootElement.appendChild(this.uiElements.container);
    }

    /**
     * Create Main Panel
     */
    createMainPanel(): void {
        const mainPanel = document.createElement("div");
        mainPanel.classList.add("panel");
        mainPanel.classList.add("main-panel");

        const title = document.createElement("div");
        title.classList.add("text-center");
        title.innerHTML = "<h3>TETRIS-TS</h3>";
        mainPanel.appendChild(title);

        const controls = document.createElement("div");
        controls.classList.add("controls");

        const controlsTitle = document.createElement("div");
        controlsTitle.innerHTML = "CONTROLS";
        controlsTitle.classList.add("label");
        controls.appendChild(controlsTitle);

        this.uiElements.controls = controls;
        this.createControlTable();
        mainPanel.appendChild(controls);

        const playButton = document.createElement("div");
        playButton.classList.add("text-center");
        playButton.innerHTML = "<div class='button'>PLAY</div>";
        this.uiElements.playButton = playButton;

        playButton.onclick = (): void => {
            this.eventBus.publish("PLAY_CLICK");
        };

        mainPanel.appendChild(playButton);

        this.uiElements.mainPanel = mainPanel;
        this.uiElements.container.appendChild(this.uiElements.mainPanel);
    }

    createControlTable(): void {
        interface Control {
            name: string;
            desc: string;
        }

        const controls = [
            { name: "LEFT ARROW", desc: "MOVE LEFT" },
            { name: "RIGHT ARROW", desc: "MOVE RIGHT" },
            { name: "DOWN ARROW", desc: "MOVE DOWN" },
            { name: "UP ARROW", desc: "ROTATE" },
        ];

        const controlTable = document.createElement("table");
        controlTable.classList.add("control-table");

        controls.forEach((control: Control) => {
            const controlRow = document.createElement("tr");

            const controlName = document.createElement("td");
            controlName.innerHTML = control.name;
            controlRow.appendChild(controlName);

            const controlDesc = document.createElement("td");
            controlDesc.innerHTML = control.desc;
            controlRow.appendChild(controlDesc);

            controlTable.appendChild(controlRow);
        });

        this.uiElements.controls.appendChild(controlTable);
    }

    /**
     * Create Container for Game Board
     */
    createGamePanel(): void {
        const gamePanel = document.createElement("div");
        gamePanel.classList.add("panel");
        gamePanel.classList.add("game-panel");

        this.uiElements.gamePanel = gamePanel;
        this.uiElements.container.appendChild(this.uiElements.gamePanel);

        this.createStatsPanel();
    }

    /**
     * Create Game Board
     */
    createGameBoard(): void {
        const gameBoard = document.createElement("div");
        gameBoard.classList.add("game-board");

        this.uiElements.gameBoard = gameBoard;

        this.uiElements.gamePanel.appendChild(this.uiElements.gameBoard);
    }

    /**
     * Draw Spaces on Game Board
     */
    createGameBoardSpaces(): void {
        for (let r = 0; r < GAME_ROWS; r++) {
            const row = document.createElement("div");
            row.classList.add("game-row");
            row.style.cssText = `height: ${this.uiElements.gameBoard
                .clientWidth / GAME_COLS}px;`;

            for (let c = 0; c < GAME_COLS; c++) {
                const space = document.createElement("div");
                space.classList.add("game-space");
                row.appendChild(space);
            }

            this.uiElements.gameBoard.appendChild(row);
        }
    }

    /**
     * Create stats panel
     */
    createStatsPanel(): void {
        const statsPanel = document.createElement("div");
        statsPanel.classList.add("stats-panel");

        const pointsLabel = document.createElement("div");
        pointsLabel.classList.add("stats-label");
        pointsLabel.innerHTML = "POINTS";
        statsPanel.appendChild(pointsLabel);

        const pointsValue = document.createElement("div");
        pointsValue.classList.add("stats-value");
        this.uiElements.points = pointsValue;
        statsPanel.appendChild(pointsValue);

        const linesLabel = document.createElement("div");
        linesLabel.classList.add("stats-label");
        linesLabel.innerHTML = "LINES";
        statsPanel.appendChild(linesLabel);

        const linesValue = document.createElement("div");
        linesValue.classList.add("stats-value");
        this.uiElements.lines = linesValue;
        statsPanel.appendChild(linesValue);

        const levelLabel = document.createElement("div");
        levelLabel.classList.add("stats-label");
        levelLabel.innerHTML = "LEVEL";
        statsPanel.appendChild(levelLabel);

        const levelValue = document.createElement("div");
        levelValue.classList.add("stats-value");
        this.uiElements.level = levelValue;
        statsPanel.appendChild(levelValue);

        this.uiElements.container.appendChild(statsPanel);
    }

    /**
     * Draw a game piece on the game board
     * @param gamePiece
     */
    drawGamePiece(gamePiece: GamePiece): void {
        gamePiece.position.forEach(piece => {
            const el = this.uiElements.gameBoard.children[piece.y].children[
                piece.x
            ];
            el.classList.add("game-piece");
            el.setAttribute(
                "style",
                `background-color: ${gamePiece.color.color};` +
                    " " +
                    `border-color: ${gamePiece.color.border};`
            );
        });
    }

    /**
     * Remove a game piece from the game board
     * @param gamePiece
     */
    eraseGamePiece(gamePiece: GamePiece): void {
        gamePiece.position.forEach(piece => {
            const el = this.uiElements.gameBoard.children[piece.y].children[
                piece.x
            ];
            el.classList.remove("game-piece");
            el.setAttribute("style", "");
        });
    }

    /**
     * Draw a row on the game board
     */
    drawRow(): void {
        const row = document.createElement("div");
        row.classList.add("game-row");
        row.style.cssText = `height: ${this.uiElements.gameBoard.clientWidth /
            GAME_COLS}px;`;

        for (let c = 0; c < GAME_COLS; c++) {
            const space = document.createElement("div");
            space.classList.add("game-space");
            row.appendChild(space);
        }

        this.uiElements.gameBoard.insertBefore(
            row,
            this.uiElements.gameBoard.children[0]
        );
    }

    updatePoints(points: number): void {
        this.uiElements.points.innerHTML = points.toString();
    }

    updateLines(lines: number): void {
        this.uiElements.lines.innerHTML = lines.toString();
    }

    updateLevel(level: number): void {
        this.uiElements.level.innerHTML = level.toString();
    }
}
