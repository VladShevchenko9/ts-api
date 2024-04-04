import moment from 'moment'
import { GeneralException } from '../Exceptions/GeneralException'
import { AbstractEvent } from './AbstractEvent'
import { EventInterface } from './EventInterface'
import * as fs from 'fs'

export class Log extends AbstractEvent implements EventInterface {
    protected getEventName(): string {
        return 'log';
    }

    protected register(): void {
        this.on(this.getEventName(), (something: string) => {
            console.log(something);
        });
    }

    public fire(str: string) {
        const currentDate = moment();
        const fileName = currentDate.format('YYYY-MM-DD');
        const content = `${currentDate.format('YYYY-MM-DD hh:mm:ss')}: ${str}\r\n\r\n`;
        
        fs.appendFile(`${__dirname}/../../logs/${fileName}.log`, content, (error) => {
            if (error) {
                throw new GeneralException(error.message);
            }
        })
    }
}
