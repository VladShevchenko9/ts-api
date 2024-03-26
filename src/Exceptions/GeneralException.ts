export class GeneralException extends Error {
    constructor(message: string) {
        super(message);
    }

    get message(): string {
        return this.message;
    }
}
