import { User } from '../Models/User'
import { AbstractRepository } from './AbstractRepository'

export class UserRepository extends AbstractRepository {
    get table(): string {
        return User.table;
    }

    public async countDuplicatesBy(
        property: string,
        value: string | number,
        exceptionId: number | null = null
    ): Promise<number> {
        const queryBuilder = this.qb.select('COUNT(id) AS total_users')
            .from(this.table)
            .where(property, '=', value);

        if (typeof exceptionId === 'number') {
            queryBuilder.andWhere('id', '!=', exceptionId);
        }

        const totalData = await this.db.getRow(queryBuilder.sql);

        if (totalData.hasOwnProperty('total_users') && typeof totalData.total_users === 'number') {
            return totalData.total_users;
        }

        throw new Error('Can`t count total users');
    }
}
