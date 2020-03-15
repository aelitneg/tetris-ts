/**
 * EventBus
 *
 * The EventBus facilitates communcation between
 * the GameEngine and the UIEngine. It is a singleton
 * which exposes a method to return the instance of the class.
 */
import GamePiece from "../GamePiece/GamePiece";
/**
 * Event interfaces
 *
 * These interfaces describe the different types of events
 * which can be published and subscribed to.
 */
/**
 * GameEvent - A basic text only event.
 */
export interface GameEvent {
    event: string;
}
/**
 * GamePieceEvent - Usually updating the position of a game piece.
 */
export interface GamePieceEvent extends GameEvent {
    gamePiece: GamePiece;
}
/**
 * RowEvent - Used for indicating rows which need to be cleared
 */
export interface RowEvent extends GameEvent {
    rows: Array<number>;
}
/**
 * StatsEvent - Used for updating points, lines, and level in the stats panel.
 */
export interface StatsEvent extends GameEvent {
    value: number;
}
/**
 * Handler
 *
 * This describes an eventhandler. It contains the
 * name of the event, and the reference to the function
 * to invoke when hanling said event.
 */
export interface Handler {
    event: string;
    handler: Function;
}
export declare class EventBus {
    private static instance;
    private handlers;
    /**
     * Get the singleton instance of the EventBus
     */
    static getInstance(): EventBus;
    /**
     * Subscribe event handler to event name
     * @param event name of event to subscribe to
     * @param handler reference to function to invoke on event
     */
    subscribe(event: string, handler: Function): void;
    /**
     * Publishers
     *
     * To maintain type safe, each event type has its own publisher
     * function. This helps avoid function overloading which will not
     * translate to Javascript when compiled.
     */
    /**
     * Publish GameEvent
     * @param event name of event
     */
    publish(event: GameEvent): void;
    /**
     * Publish GamePieceEvent
     * @param event name of event
     */
    publishGamePieceEvent(event: GamePieceEvent): void;
    /**
     * Publish RowEvent
     * @param event name of event
     */
    publishRowEvent(event: RowEvent): void;
    /**
     * Publish StatsEvent
     * @param event name of event
     */
    publishStatsEvent(event: StatsEvent): void;
}
