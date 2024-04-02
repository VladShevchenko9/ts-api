import { AbstractEvent } from './AbstractEvent'
import { EventInterface } from './EventInterface'

export class Log extends AbstractEvent implements EventInterface {
    protected getEventName(): string {
        return 'log';
    }

    protected register(): void {
        this.on(this.getEventName(), (something: string) => {
            console.log(something);
        });
    }

    public fire(str: string): void {
        this.emit(this.getEventName(), str);
    }
}
