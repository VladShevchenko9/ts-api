import { User } from '../Models/User'
import { AbstractRepository } from './AbstractRepository'

export class UserRepository extends AbstractRepository {
    get table(): string {
        return User.table;
    }

    protected getModelClass(): new () => User {
        return User;
    }
}
