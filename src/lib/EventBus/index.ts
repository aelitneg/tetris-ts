export default class EventBus {
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

    publish(event: string, gamePiece?: GamePiece, rows?: Array<number>): void {
        this.handlers.forEach(h => {
            if (h.event === event) {
                h.handler(gamePiece || rows);
            }
        });
    }
}
