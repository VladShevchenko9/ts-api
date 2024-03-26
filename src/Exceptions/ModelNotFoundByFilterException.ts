import { GeneralException } from './GeneralException'

export class ModelNotFoundByFilterException extends GeneralException {
    constructor(modelData: Record<string, number | string>) {
        let message = `Model with the following properties:`;

        for (const property in modelData) {
            message += ` ${property} = ${modelData[property]},`;
        }

        message.slice(0, -1);
        message += ` was not found.`;


        super(message);
    }
}
