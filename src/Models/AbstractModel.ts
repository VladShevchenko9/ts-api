export abstract class AbstractModel {
    protected attributes: Record<string, any> = {};
    protected static _table: string = '';
    protected static _requiredFields: Record<string, string> = {};

    public getAttrValue(attrName: string): any {
        if (this.attributes.hasOwnProperty(attrName)) {
            return this.attributes[attrName];
        }

        return null;
    }

    public setAttrValue(attrName: string, attrValue: any): AbstractModel {
        if (this.attributes.hasOwnProperty(attrName)) {
            this.attributes[attrName] = attrValue;
        }

        return this;
    }

    public getAttrList(): string[] {
        return Object.keys(this.attributes);
    }

    public static get table() {
        return this._table;
    }

    public static get requiredFields() {
        return this._requiredFields;
    }

    public toJson(): Record<string, any> {
        return this.attributes;
    }
}
