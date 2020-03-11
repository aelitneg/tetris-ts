import GamePiece from "../GamePiece/GamePiece";
import { Color, Coordinate, GamePieceType } from "../GamePiece";
import { GameState } from "../enum";
import { EventBus, GamePieceEvent, RowEvent, StatsEvent } from "../EventBus";
import { GAME_COLS, GAME_ROWS } from "../../config";
import "../styles.scss";
import { clearLine } from "readline";

export default class UIEngine {
    eventBus: EventBus;

    rootElement: Element;
    uiElements: { [key: string]: Element };
    gameState: GameState;

    constructor(rootElement: Element) {
        console.log(
            `[tetris-ts UIEngine] rootElement dimensions ${rootElement.clientWidth}x${rootElement.clientHeight}`
        );

        this.rootElement = rootElement;

        this.eventBus = EventBus.getInstance();

        this.uiElements = {};

        this.createInputListeners();
        this.setupEventHandlers();
        this.gameState = GameState.INIT;
    }

    /**
     * Build the Foundation UI Elements
     */
    initUI(): void {
        this.createMainContainer();

        this.createMainPanel();

        this.eventBus.publish({ event: "UI_READY" });
    }

    /**
     * Hide main panel and show gameboard
     */
    initGameBoard(): void {
        this.uiElements.container.removeChild(this.uiElements.mainPanel);

        this.createGamePanel();

        this.createGameBoard();

        this.createGameBoardSpaces();

        this.eventBus.publish({ event: "PLAY" });
    }

    /**
     * Add Key Listeners and Bind to Handlers
     */
    createInputListeners(): void {
        document.addEventListener("keydown", e => {
            switch (e.code) {
                case "ArrowLeft":
                    this.eventBus.publish({ event: "INPUT_LEFT" });
                    break;
                case "ArrowRight":
                    this.eventBus.publish({ event: "INPUT_RIGHT" });
                    break;
                case "ArrowDown":
                    this.eventBus.publish({ event: "INPUT_DOWN" });
                    break;
                case "ArrowUp":
                    this.eventBus.publish({ event: "INPUT_UP" });
                    break;
                case "Space":
                    this.eventBus.publish({ event: "INPUT_SPACE" });
            }
        });
    }

    /**
     * Setup Event Handlers for EventBus Events
     */
    setupEventHandlers(): void {
        this.eventBus.subscribe("INIT", () => {
            this.initUI();
        });

        this.eventBus.subscribe("PLAY_CLICK", () => {
            this.playClickHandler();
        });

        this.eventBus.subscribe("DRAW_ACTIVE", (event: GamePieceEvent) => {
            this.drawGamePiece(event.gamePiece);
        });

        this.eventBus.subscribe("ERASE_ACTIVE", (event: GamePieceEvent) => {
            this.eraseGamePiece(event.gamePiece);
        });

        this.eventBus.subscribe("REMOVE_ROWS", (event: RowEvent) => {
            this.completeRow(event.rows);
        });

        this.eventBus.subscribe("UPDATE_POINTS", (event: StatsEvent) => {
            this.updatePoints(event.value);
        });

        this.eventBus.subscribe("UPDATE_LINES", (event: StatsEvent) => {
            this.updateLines(event.value);
        });

        this.eventBus.subscribe("UPDATE_LEVEL", (event: StatsEvent) => {
            this.updateLevel(event.value);
        });

        this.eventBus.subscribe("DRAW_NEXT", (event: GamePieceEvent) => {
            this.drawNextPiece(event.gamePiece);
        });

        this.eventBus.subscribe(
            "INPUT_SPACE",
            this.inputSpaceHandler.bind(this)
        );
    }

    playClickHandler(): void {
        this.gameState = GameState.PLAYING;
        this.initGameBoard();
    }

    inputSpaceHandler(): void {
        switch (this.gameState) {
            case GameState.PLAYING:
                this.togglePause();
                this.gameState = GameState.PAUSED;
                break;
            case GameState.PAUSED:
                this.togglePause();
                this.gameState = GameState.PLAYING;
                break;
        }
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
            this.eventBus.publish({ event: "PLAY_CLICK" });
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

        this.uiElements.statsPanel = statsPanel;
        this.uiElements.container.appendChild(statsPanel);

        this.createNextPieceContainer();
    }

    createNextPieceContainer(): void {
        const square = this.uiElements.statsPanel.clientWidth - 30;

        const nextPieceContainer = document.createElement("div");
        nextPieceContainer.classList.add("next-piece-container");
        nextPieceContainer.setAttribute(
            "style",
            `height: ${square}px; width: ${square}`
        );

        this.uiElements.nextPieceContainer = nextPieceContainer;
        this.uiElements.statsPanel.appendChild(nextPieceContainer);
    }

    drawNextPiece(gamePiece: GamePiece): void {
        if (this.uiElements.nextPiece) {
            this.uiElements.nextPieceContainer.removeChild(
                this.uiElements.nextPiece
            );
        }

        const nextPiece = document.createElement("div");
        nextPiece.classList.add("next-piece");
        this.uiElements.nextPiece = nextPiece;

        switch (gamePiece.type) {
            case GamePieceType.BLOCK:
                this.createNextPieceSpaces(2, 2);
                this.setNextPieceActive(
                    [
                        { x: 0, y: 0 },
                        { x: 1, y: 0 },
                        { x: 0, y: 1 },
                        { x: 1, y: 1 },
                    ],
                    gamePiece.color
                );
                break;
            case GamePieceType.LINE:
                this.createNextPieceSpaces(1, 4);
                this.setNextPieceActive(
                    [
                        { x: 0, y: 0 },
                        { x: 1, y: 0 },
                        { x: 2, y: 0 },
                        { x: 3, y: 0 },
                    ],
                    gamePiece.color
                );
                break;
            case GamePieceType.T:
                this.createNextPieceSpaces(2, 3);
                this.setNextPieceActive(
                    [
                        { x: 0, y: 0 },
                        { x: 1, y: 0 },
                        { x: 2, y: 0 },
                        { x: 1, y: 1 },
                    ],
                    gamePiece.color
                );
                break;
            case GamePieceType.L:
                this.createNextPieceSpaces(2, 3);
                this.setNextPieceActive(
                    [
                        { x: 0, y: 0 },
                        { x: 1, y: 0 },
                        { x: 2, y: 0 },
                        { x: 0, y: 1 },
                    ],
                    gamePiece.color
                );
                break;
            case GamePieceType.L_INV:
                this.createNextPieceSpaces(2, 3);
                this.setNextPieceActive(
                    [
                        { x: 0, y: 0 },
                        { x: 1, y: 0 },
                        { x: 2, y: 0 },
                        { x: 2, y: 1 },
                    ],
                    gamePiece.color
                );
                break;
            case GamePieceType.Z:
                this.createNextPieceSpaces(2, 3);
                this.setNextPieceActive(
                    [
                        { x: 0, y: 0 },
                        { x: 1, y: 0 },
                        { x: 1, y: 1 },
                        { x: 2, y: 1 },
                    ],
                    gamePiece.color
                );
                break;
            case GamePieceType.Z_INV:
                this.createNextPieceSpaces(2, 3);
                this.setNextPieceActive(
                    [
                        { x: 1, y: 0 },
                        { x: 2, y: 0 },
                        { x: 0, y: 1 },
                        { x: 1, y: 1 },
                    ],
                    gamePiece.color
                );
                break;
        }

        this.uiElements.nextPieceContainer.appendChild(nextPiece);
    }

    setNextPieceActive(position: Array<Coordinate>, color: Color): void {
        const nextPiece = this.uiElements.nextPiece;

        position.forEach(c => {
            const p = nextPiece.children[c.y].children[c.x];
            p.classList.add("next-piece-active");
            p.setAttribute(
                "style",
                `${p.getAttribute("style")} background-color: ${
                    color.color
                }; border-color: ${color.border};`
            );
        });
    }

    createNextPieceSpaces(rows: number, cols: number): void {
        const square = this.uiElements.statsPanel.clientWidth - 30;

        for (let r = 0; r < rows; r++) {
            const row = document.createElement("div");
            row.setAttribute("style", `line-height: ${square / 4}px`);
            for (let c = 0; c < cols; c++) {
                const cell = document.createElement("div");
                cell.classList.add("next-piece-cell");
                cell.setAttribute(
                    "style",
                    `height: ${square / 5}px; 
                    width: ${square / 5}px;`
                );
                row.appendChild(cell);
            }
            this.uiElements.nextPiece.appendChild(row);
        }
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

    togglePause(): void {
        if (this.gameState === GameState.PLAYING) {
            this.uiElements.container.classList.add("paused");
        } else {
            this.uiElements.container.classList.remove("paused");
        }
    }
}
