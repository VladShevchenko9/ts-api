import { RequestValidator } from 'request-validator-js'
import { Request } from 'express'

export abstract class AbstractRequest {
    protected rules: Record<string, string>;

    public validate(data: Record<string, any>, customErrors: Record<string, string> = {}): void {
        const request = new RequestValidator();
        const errors = request.validate(data, this.rules, customErrors)

        if (!Object.keys(errors.errors).length) {
            return;
        }
        // @todo: display actual errors
        throw new Error('Invalid request');
    };

    public getRequestData(props: string[], request: Request): Record<string, any> {
        let requestdata = {};

        props.map(prop => {
            requestdata[prop] = null;

            if (request.body.hasOwnProperty(prop)) {
                requestdata[prop] = request.body[prop];
            }
        });

        return requestdata;
    }
}
