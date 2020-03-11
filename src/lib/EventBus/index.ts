import GamePiece from "../GamePiece/GamePiece";

export interface GameEvent {
    event: string;
}

export interface GamePieceEvent extends GameEvent {
    gamePiece: GamePiece;
}

export interface RowEvent extends GameEvent {
    rows: Array<number>;
}

export interface StatsEvent extends GameEvent {
    value: number;
}

export interface Handler {
    event: string;
    handler: Function;
}

export class EventBus {
    private static instance: EventBus;

    private handlers: Array<Handler>;

    static getInstance(): EventBus {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
            EventBus.instance.handlers = [];
        }

        return EventBus.instance;
    }

    subscribe(event: string, handler: Function): void {
        this.handlers.push({
            event: event,
            handler: handler,
        });
    }

    publish(event: GameEvent): void {
        this.handlers.forEach(h => {
            if (h.event === event.event) {
                h.handler(event);
            }
        });
    }

    publishGamePieceEvent(event: GamePieceEvent): void {
        this.handlers.forEach(h => {
            if (h.event === event.event) {
                h.handler(event);
            }
        });
    }

    publishRowEvent(event: RowEvent): void {
        this.handlers.forEach(h => {
            if (h.event === event.event) {
                h.handler(event);
            }
        });
    }

    publishStatsEvent(event: StatsEvent): void {
        this.handlers.forEach(h => {
            if (h.event === event.event) {
                h.handler(event);
            }
        });
    }
}
