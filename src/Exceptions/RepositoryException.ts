import { GeneralException } from './GeneralException'

export class RepositoryException extends GeneralException {
    constructor(message: string) {
        super(message);
    }
}
