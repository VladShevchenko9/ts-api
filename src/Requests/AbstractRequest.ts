import { Request } from 'express'

export abstract class AbstractRequest {
    public populateData(req: Request): void {
        const context = this;
        Object.keys(context).map(property => {
            context[property] = req.body[property];
        });
    }

    public refresh(): void {
        const context = this;
        Object.keys(context).map(property => {
            context[property] = null;
        });
    }
}
