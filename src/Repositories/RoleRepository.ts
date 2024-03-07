import { Role } from '../Models/Role'
import { AbstractRepository } from './AbstractRepository'

export class RoleRepository extends AbstractRepository {
    get table(): string {
        return Role.table;
    }

    protected getModelClass(): new () => Role {
        return Role;
    }
}
