import { EventEmitter } from 'events'

export abstract class AbstractEvent extends EventEmitter {
    constructor() {
        super();
        this.register();
    }
    
    public emitEvent(...args: any[]): void {
        this.emit(this.getEventName(), ...args);
    }

    public abstract getEventName(): string;

    protected abstract register(): void;
}
