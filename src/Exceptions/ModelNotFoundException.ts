import { GeneralException } from './GeneralException'

export class ModelNotFoundException extends GeneralException {
    constructor(id: number) {
        const message = `Model with id "${id}" was not found.`;
        super(message);
    }
}
