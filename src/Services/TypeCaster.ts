export class TypeCaster {
    public static objValuesToString(data: Record<string, any>): void {
        Object.keys(data).map(prop => {
            data[prop] = String(data[prop]);
        })
    }
}
