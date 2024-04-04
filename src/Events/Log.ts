import moment from 'moment'
import { GeneralException } from '../Exceptions/GeneralException'
import { AbstractEvent } from './AbstractEvent'
import * as fs from 'fs'

export class Log extends AbstractEvent {
    public getEventName(): string {
        return 'log';
    }

    protected register(): void {
        this.on(this.getEventName(), (str: string) => {
            const currentDate = moment();
            const fileName = currentDate.format('YYYY-MM-DD');
            const content = `${currentDate.format('YYYY-MM-DD hh:mm:ss')}: ${str}\r\n\r\n`;

            fs.appendFile(`${__dirname}/../../logs/${fileName}.log`, content, (error) => {
                if (error) {
                    throw new GeneralException(error.message);
                }
            })
        });
    }
}
