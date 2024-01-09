import { Connection, createConnection, escape as mySqlEscape } from 'mysql'

export class DB {
    private _connection: Connection;

    constructor() {
        this._connection = DB._createConnection();
    }

    public insert(sql: string, data: Record<string, any> = {}): Promise<number> {
        return new Promise((resolve, reject) => {
            this._connection.query(sql, data, function (error, result) {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(result?.insertId || 0);
            })
        });
    }

    public executeQuery(sql: string, data: Record<string, any> = {}): Promise<Record<string, any>[]> {
        return new Promise((resolve, reject) => {
            this._connection.query(sql, data, function (error, result) {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(result);
            })
        });
    }

    public getRow(sql: string, values: any[] = []): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!sql.toUpperCase().startsWith('SELECT ')) {
                reject(new Error('Invalid SQL for method getRow'));
                return;
            }

            this._connection.query(sql, values, function (error, result: any) {
                if (error) {
                    reject(error);
                    return;
                }

                if (Array.isArray(result) && result.length > 0) {
                    resolve(result[0]);
                    return;
                }

                reject(new Error('Unable to find a row by the following SQL: ' + sql));
            })
        });
    }

    public static escape(value: any, stringifyObjects?: boolean, timeZone?: string): string {
        return mySqlEscape(value, stringifyObjects, timeZone);
    }

    private static _createConnection(): Connection {
        const connection = createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "users_api_db",
            // debug: true,
        });

        connection.connect(function (err: Error) {
            if (err) {
                console.log('Unable to connect to DataBase');
                throw err;
            }
        });

        return connection;
    }
}
