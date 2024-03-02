export abstract class AbstractModel {
    protected attributes: Record<string, any> = {};
    protected static _table: string = '';

    public populateFromObject(data: Record<string, any>): AbstractModel {
        this.getAttrList().map(attribute => {
            if (data.hasOwnProperty(attribute)) {
                this.setAttrValue(attribute, data[attribute]);
            }
        });

        return this;
    }

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

    public static get table(): string {
        return this._table;
    }

    public toJson(): Record<string, any> {
        return this.attributes;
    }
}
