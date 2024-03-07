import { Container } from '../Container'
import { User } from '../Models/User'
import { RoleRepository } from '../Repositories/RoleRepository'
import { DB } from './DB'
import { QueryBuilder } from './QueryBuilder'

export class RoleChecker {
    private static readonly adminRole = 'admin';
    private static readonly userRole = 'user';

    public static async isAdmin(user: User): Promise<boolean> {
        return await this.getUserRoleName(user) === this.adminRole;

    }
    public static async isUser(user: User): Promise<boolean> {
        return await this.getUserRoleName(user) === this.userRole;
    }

    private static getRoleRepository(): RoleRepository {
        const db = Container.createInstance<DB>(DB.name);
        const qb = Container.createInstance<QueryBuilder>(QueryBuilder.name);
        return Container.createInstance<RoleRepository>(RoleRepository.name, db, qb);
    }

    private static async getUserRoleName(user: User): Promise<string> {
        const role = await this.getRoleRepository().find(user.getAttrValue('role_id'));
        return role.getAttrValue('name');
    }
}
