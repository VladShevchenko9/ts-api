import knex from 'knex'
import 'dotenv/config'

export class KnexQueryBuilder {
    private _qb: knex.Knex;

    constructor() {
        this.makeConnection();
    }

    get qb(): knex.Knex {
        return this._qb;
    }

    private makeConnection(): void {
        this._qb = knex({
            client: 'mysql',
            connection: {
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
            }
        });
    }
}
