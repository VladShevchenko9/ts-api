import { RepositoryException } from './RepositoryException'

export class UnexpectedDbData extends RepositoryException {
    constructor(property: string) {
        const message = `Expected to have "${property}" property but it was not found in a result object.`;
        super(message);
    }
}
