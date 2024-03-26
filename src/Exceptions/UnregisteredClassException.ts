import { GeneralException } from './GeneralException'

export class UnregisteredClassException extends GeneralException {
    constructor(className: string) {
        const message = `Class "${className}" is not registered.`;

        super(message);
    }
}
