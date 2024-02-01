import { DB } from '../Services/DB'
import { QueryBuilder } from '../Services/QueryBuilder'

export abstract class AbstractRepository {
    protected db: DB;
    protected qb: QueryBuilder;
    readonly recordsPerPage: number = 5;

    constructor(db: DB, qb: QueryBuilder,) {
        this.db = db;
        this.qb = qb;
    }

    public async getAll(page: number = 1): Promise<Record<string, any>[]> {
        const offset = (page - 1) * this.recordsPerPage

        const sql = this.qb.select().from(this.table).limit(this.recordsPerPage).offset(offset).sql;
        return await this.db.executeQuery(sql) || [];
    }

    public async find(id: number): Promise<Record<string, any>> {
        const sql = this.qb.select().from(this.table).where('id', '=', id).sql;
        return await this.db.getRow(sql);
    }

    public async create(data: Record<string, any>): Promise<number> {
        const sql = this.qb.insert(this.table).set(data).sql;
        return await this.db.insert(sql);
    }

    public async update(id: number, data: Record<string, any>): Promise<void> {
        const sql = this.qb.update(this.table).set(data).where('id', '=', id).sql;
        await this.db.executeQuery(sql);
    }

    public async delete(id: number): Promise<void> {
        const sql = this.qb.delete().from(this.table).where('id', '=', id).sql;
        await this.db.executeQuery(sql);
    }

    public async findBy(filter: Record<string, number | string>): Promise<Record<string, any>> {
        const queryBuilder = this.qb.select('*').from(this.table);
        const fields = Object.keys(filter);

        for (let i = 0; i < fields.length; i++) {
            if (i === 0) {
                queryBuilder.where(fields[0], '=', filter[fields[0]]);
                continue;
            }

            queryBuilder.andWhere(fields[i], '=', filter[fields[i]]);
        }

        return await this.db.getRow(queryBuilder.sql);
    }

    abstract get table(): string;
}
