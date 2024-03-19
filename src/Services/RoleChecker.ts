import { Container } from '../Container'
import { User } from '../Models/User'
import { RoleRepository } from '../Repositories/RoleRepository'
import { KnexQueryBuilder } from './KnexQueryBuilder'

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
        const knexQb = Container.createInstance<KnexQueryBuilder>(KnexQueryBuilder.name);
        return Container.createInstance<RoleRepository>(RoleRepository.name, knexQb);
    }

    private static async getUserRoleName(user: User): Promise<string> {
        const role = await this.getRoleRepository().find(user.getAttrValue('role_id'));
        return role.getAttrValue('name');
    }
}
