import { DB } from './DB'

export class QueryBuilder {
    private _sql: string = '';
    private _availableMethods: string[] = [this.select.name, this.insert.name, this.update.name, this.delete.name];
    private _forbiddenMethods: string[] = [];

    get sql(): string {
        const sql = this._sql;
        this.reset();

        return sql;
    }

    public select(fields: string | string[] = '*'): this {
        this.validateMethodCall(this.select.name, [this.from.name]);

        if (Array.isArray(fields)) {
            fields = fields.join(', ');
        }

        this._sql = 'SELECT ' + fields;

        return this;
    }


    public insert(table: string): this {
        this._forbiddenMethods = [
            this.where.name,
            this.andWhere.name,
            this.orWhere.name,
            this.orderBy.name,
            this.limit.name,
        ];

        this.validateMethodCall(this.insert.name, [this.set.name]);
        this._sql = 'INSERT' + ' INTO ' + table;

        return this;
    }

    public delete(): this {
        this._forbiddenMethods = [
            this.orderBy.name,
            this.limit.name,
        ];

        this.validateMethodCall(this.select.name, [this.from.name]);
        this._sql = 'DELETE';

        return this;
    }

    public update(table: string): this {
        this._forbiddenMethods = [
            this.orderBy.name,
            this.limit.name,
        ];

        this.validateMethodCall(this.update.name, [this.set.name]);
        this._sql = 'UPDATE ' + table;

        return this;
    }

    public from(table: string): this {
        this.validateMethodCall(this.from.name, [this.where.name, this.orderBy.name, this.limit.name]);
        this._sql += ' FROM ' + table;

        return this;
    }

    public set(data: Record<string, number | string>, escape: boolean = true): this {
        this.validateMethodCall(this.set.name, [this.where.name]);
        this._sql += ' SET ';
        Object.keys(data).map(field => {
            this._sql += field + ' = ' + this.escapeOptionally(data[field], escape) + ', ';
        });

        this._sql = this._sql.substring(0, this._sql.length - 2);

        return this;
    }

    public where(field: string, operator: string, value: number | string, escape: boolean = true): this {
        this.validateMethodCall(this.where.name, [
            this.orWhere.name,
            this.andWhere.name,
            this.orderBy.name,
            this.limit.name,
        ]);

        this._sql += ' WHERE ' + field + ' ' + operator + ' ' + this.escapeOptionally(value, escape);

        return this;
    }

    public andWhere(field: string, operator: string, value: number | string): this {
        this.validateMethodCall(this.andWhere.name, [
            this.orWhere.name,
            this.andWhere.name,
            this.orderBy.name,
            this.limit.name,
        ]);

        this._sql += ' AND ' + field + ' ' + operator + ' ' + DB.escape(value);

        return this;
    }

    public orWhere(field: string, operator: string, value: number | string): this {
        this.validateMethodCall(this.orWhere.name, [
            this.orWhere.name,
            this.andWhere.name,
            this.orderBy.name,
            this.limit.name,
        ]);

        this._sql += ' OR ' + field + ' ' + operator + ' ' + DB.escape(value);

        return this;
    }

    public orderBy(field: string, sortOrder: 'ASC' | 'DESC'): this {
        this.validateMethodCall(this.orderBy.name, [
            this.limit.name,
        ]);

        this._sql += ' ORDER BY ' + field + ' ' + sortOrder;

        return this;
    }

    public limit(n: number): this {
        this.validateMethodCall(this.limit.name, [this.offset.name]);
        this._sql += ' LIMIT ' + n;

        return this;
    }

    public offset(n: number): this {
        this.validateMethodCall(this.offset.name, []);
        this._sql += ' OFFSET ' + n;

        return this;
    }

    private validateMethodCall(methodName: string, nextMethods: string[]): void {
        if (!this._availableMethods.includes(methodName) || this._forbiddenMethods.includes(methodName)) {
            throw new Error('Illegal usage of "' + methodName + '" method');
        }

        this._availableMethods = nextMethods;
    }

    private reset(): void {
        this._sql = '';
        this._availableMethods = [this.select.name, this.insert.name, this.update.name, this.delete.name];
        this._forbiddenMethods = [];
    }

    private escapeOptionally(value: number | string, escape: boolean): number | string {
        if (escape) {
            value = DB.escape(value);
        }
        return value;
    }
}
