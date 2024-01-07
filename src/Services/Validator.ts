export class Validator {
    public static checkRequiredFields(data: Record<string, any>, requiredFields: Record<string, string>): void {
        Object.keys(requiredFields).map(field => {
            if (
                !data.hasOwnProperty(field)
                || !data[field] && data[field] !== 0
                || typeof data[field] === "string" && data[field].trim() === ''
            ) {
                throw new Error(requiredFields[field] + ' is required');
            }
        });

        Object.keys(data).map(field => {
            if (!requiredFields.hasOwnProperty(field)) {
                throw new Error('Unknown field: ' + field);
            }
        });
    }
}
