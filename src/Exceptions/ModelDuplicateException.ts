import { GeneralException } from './GeneralException'

export class ModelDuplicateException extends GeneralException {
    constructor(property: string, value: string | number) {
        const message = `Model with the following ${property} allready exists. Duplicated value: ${value}.`;
        super(message);
    }
}
