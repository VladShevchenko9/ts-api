export class TypeCaster {
    public static toStringOfUndefined(value: any): string | undefined {
        if (!value) {
            return undefined;
        }
        return String(value);
    }
}