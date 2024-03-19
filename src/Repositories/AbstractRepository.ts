import knex from 'knex';
import { AbstractModel } from '../Models/AbstractModel'
import { CommonIndexRequest } from '../Requests/CommonIndexRequest'
import { KnexQueryBuilder } from '../Services/KnexQueryBuilder'

export abstract class AbstractRepository {
    protected qb: knex.Knex;

    constructor(knexQb: KnexQueryBuilder) {
        this.qb = knexQb.qb;
    }

    public async countBy(
        property: string,
        value: string | number,
        exceptionId: number | null = null,
        table: string = this.table,
    ): Promise<number> {
        const queryBuilder = this.qb(table).where(property, '=', value)

        if (typeof exceptionId === 'number') {
            queryBuilder.andWhere('id', '!=', exceptionId);
        }

        const totalData = await queryBuilder.count('id as total').first();

        if (totalData.hasOwnProperty('total') && typeof totalData.total === 'number') {
            return totalData.total;
        }

        throw new Error('Can`t count total records');
    }

    public async getAll(queryData: CommonIndexRequest): Promise<AbstractModel[]> {
        const offset = (queryData.page - 1) * queryData.limit;
        const builder = this.qb.select().from(this.table);
        const filterData = queryData.filter.toRecord();
        Object.keys(filterData).map((property) => {
            builder.where(property, '=', queryData[property]);
        });
        const records = await builder.limit(queryData.limit).offset(offset);

        return records.map(data => this.makeModel(data));
    }

    public async find(id: number): Promise<AbstractModel> {
        const data = await this.qb.select().from(this.table).where('id', '=', id).first();
        return this.makeModel(data);
    }

    public async create(data: Record<string, any>): Promise<number> {
        const ids = await this.qb.insert(data).into(this.table);
        return ids.pop();
    }

    public async update(id: number, data: Record<string, any>): Promise<void> {
        await this.qb.update(data).table(this.table).where('id', '=', id);
    }

    public async delete(id: number): Promise<void> {
        await this.qb.delete().from(this.table).where('id', '=', id);
    }

    public async findBy(filter: Record<string, number | string>): Promise<AbstractModel> {
        const queryBuilder = this.qb.select('*').from(this.table);
        const fields = Object.keys(filter);

        for (let i = 0; i < fields.length; i++) {
            queryBuilder.where(fields[i], '=', filter[fields[i]]);
        }

        const data = await queryBuilder.first();
        return this.makeModel(data);
    }

    protected makeModel(data: Record<string, any>): AbstractModel {
        const modelConstructor = this.getModelClass();
        return new modelConstructor().populateFromObject(data);
    }

    abstract get table(): string;
    protected abstract getModelClass(): new () => AbstractModel;
}
