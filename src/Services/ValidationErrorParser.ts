import { ValidationError } from 'class-validator'

export class ValidationErrorParser {
    public static parseValidationErrors(errors: ValidationError[]): Record<string, string> {
        const errorsObj = {};

        for (const error of errors) {
            errorsObj[error.property] = [];

            for (const constraintKey in error.constraints) {
                errorsObj[error.property].push(error.constraints[constraintKey]);
            }
        }

        return errorsObj;
    }
}
