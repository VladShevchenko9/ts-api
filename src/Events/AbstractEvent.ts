import { EventEmitter } from 'events'

export abstract class AbstractEvent extends EventEmitter {
    constructor() {
        super();
        this.register();
    }
    protected abstract getEventName(): string;

    protected abstract register(): void;
}
