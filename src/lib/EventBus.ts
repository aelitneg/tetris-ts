import GamePiece from "./GamePiece"; // eslint-disable-line no-unused-vars

interface IHandler {
    event: string;
    handler: Function;
    gamePiece?: GamePiece;
}

export default class EventBus {
    private static instance: EventBus;

    private handlers: Array<IHandler>;

    private constructor() {}

    static getInstance() {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
            EventBus.instance.handlers = [];
        }

        return EventBus.instance;
    }

    subscribe(event: string, handler: Function) {
        this.handlers.push({
            event: event,
            handler: handler,
        });
    }

    publish(event: string, gamePiece?: GamePiece) {
        this.handlers.forEach(h => {
            if (h.event === event) {
                h.handler(gamePiece);
            }
        });
    }
}
