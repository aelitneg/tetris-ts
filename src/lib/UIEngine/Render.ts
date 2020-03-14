/**
 * Render
 *
 * This class exclusively handles DOM manipulation. It is responsible
 * for adding and removing the uiElements to and form the DOM.
 */
import { GAME_COLS, GAME_ROWS } from "../../config";
import GamePiece from "../GamePiece/GamePiece";
import { Coordinate, Color } from "../GamePiece";

export default class Render {
    rootElement: Element;
    uiElements: { [key: string]: Element };

    constructor(rootElement: Element, uiElements: { [key: string]: Element }) {
        this.rootElement = rootElement;
        this.uiElements = uiElements;
    }

    createMainContainer(): void {
        const container = document.createElement("div");
        container.classList.add("container");

        this.uiElements.container = container;

        this.rootElement.appendChild(this.uiElements.container);
    }

    /**
     * Create main menu
     * @param playEvent event fired on play button onclick
     */
    createMenuPanel(playEvent: Function): void {
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
            playEvent();
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
            { name: "SPACE", desc: "PAUSE" },
            { name: "ESC", desc: "QUIT" },
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

    createGamePanel(): void {
        const gamePanel = document.createElement("div");
        gamePanel.classList.add("panel");
        gamePanel.classList.add("game-panel");

        this.uiElements.gamePanel = gamePanel;
        this.uiElements.container.appendChild(this.uiElements.gamePanel);

        this.createStatsPanel();

        this.createGameBoard();
    }

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

    createGameBoard(): void {
        const gameBoard = document.createElement("div");
        gameBoard.classList.add("game-board");

        this.uiElements.gameBoard = gameBoard;

        this.uiElements.gamePanel.appendChild(this.uiElements.gameBoard);

        this.createGameBoardSpaces();
    }

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

    /**
     * Remove rows from  game board
     * @param rows row indexes to remove
     */
    removeRow(rows: Array<number>): void {
        rows.forEach(row => {
            this.uiElements.gameBoard.children[row].remove();
            this.drawRow();
        });
    }

    drawNextPiece(gamePiece: GamePiece): void {
        if (this.uiElements.nextPiece) {
            this.uiElements.nextPieceContainer.removeChild(
                this.uiElements.nextPiece
            );
        }

        const nextPiece = document.createElement("div");
        this.uiElements.nextPiece = nextPiece;

        this.createNextPieceSpaces(
            gamePiece.nextPieceDims.rows,
            gamePiece.nextPieceDims.cols
        );
        this.setNextPieceActive(gamePiece.nextPieceMap, gamePiece.color);

        this.uiElements.nextPieceContainer.appendChild(nextPiece);
    }

    setNextPieceActive(position: Array<Coordinate>, color: Color): void {
        const nextPiece = this.uiElements.nextPiece;

        position.forEach(c => {
            const p = nextPiece.children[c.y].children[c.x];
            p.setAttribute(
                "style",
                `${p.getAttribute("style")} background-color: ${
                    color.color
                }; border-color: ${color.border};`
            );
        });
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
