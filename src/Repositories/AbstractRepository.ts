import { AbstractModel } from '../Models/AbstractModel'
import { CommonIndexRequest } from '../Requests/CommonIndexRequest'
import { DB } from '../Services/DB'
import { QueryBuilder } from '../Services/QueryBuilder'

export abstract class AbstractRepository {
    protected db: DB;
    protected qb: QueryBuilder;

    constructor(db: DB, qb: QueryBuilder,) {
        this.db = db;
        this.qb = qb;
    }

    public async countBy(
        property: string,
        value: string | number,
        exceptionId: number | null = null,
        table: string = this.table,
    ): Promise<number> {
        const queryBuilder = this.qb.select('COUNT(id) AS total')
            .from(table)
            .where(property, '=', value);

        if (typeof exceptionId === 'number') {
            queryBuilder.andWhere('id', '!=', exceptionId);
        }

        const totalData = await this.db.getRow(queryBuilder.sql);

        if (totalData.hasOwnProperty('total') && typeof totalData.total === 'number') {
            return totalData.total;
        }

        throw new Error('Can`t count total records');
    }

    public async getAll(queryData: CommonIndexRequest): Promise<AbstractModel[]> {
        const offset = (queryData.page - 1) * queryData.limit;
        const builder = this.qb.select().from(this.table);
        const filterData = queryData.filter.toRecord();
        Object.keys(filterData).map((property, index) => {
            if (index === 0) {
                builder.where(property, '=', filterData[property]);
                return;
            }

            builder.andWhere(property, '=', queryData[property]);
        });
        const sql = builder.limit(queryData.limit).offset(offset).sql;
        const records = await this.db.executeQuery(sql) || [];

        return records.map(data => this.makeModel(data));
    }

    public async find(id: number): Promise<AbstractModel> {
        const sql = this.qb.select().from(this.table).where('id', '=', id).sql;
        const data = await this.db.getRow(sql);
        return this.makeModel(data);
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

    public async findBy(filter: Record<string, number | string>): Promise<AbstractModel> {
        const queryBuilder = this.qb.select('*').from(this.table);
        const fields = Object.keys(filter);

        for (let i = 0; i < fields.length; i++) {
            if (i === 0) {
                queryBuilder.where(fields[0], '=', filter[fields[0]]);
                continue;
            }

            queryBuilder.andWhere(fields[i], '=', filter[fields[i]]);
        }

        const data = await this.db.getRow(queryBuilder.sql);
        return this.makeModel(data);
    }

    protected makeModel(data: Record<string, any>): AbstractModel {
        const modelConstructor = this.getModelClass();
        return new modelConstructor().populateFromObject(data);
    }

    abstract get table(): string;
    protected abstract getModelClass(): new () => AbstractModel;
}
