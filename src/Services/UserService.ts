import { User } from '../Models/User'
import { UserRepository } from '../Repositories/UserRepository'
import { CrudServiceInterface } from './CrudServiceInterface'
import { AbstractModelService } from './AbstractModelService'
import bcrypt from 'bcrypt'

export class UserService extends AbstractModelService implements CrudServiceInterface {
    protected repository: UserRepository;

    constructor(userRepo: UserRepository) {
        super(userRepo);
    }

    public async getUserByEmail(email: string): Promise<User> {
        let user;

        try {
            user = await this.repository.findBy({ email: email });
        } catch (e) {
            throw new Error('User does not exist');
        }

        return user;
    }

    protected async validateModelData(data: Record<string, any>, id: number | null = null): Promise<Record<string, any>> {
        let emailDuplicates, phoneDuplicates;

        try {
            emailDuplicates = await this.repository.countBy('email', data.email, id);
            phoneDuplicates = await this.repository.countBy('phone_number', data.phone_number, id);
        } catch (e) {
            throw new Error('Unable to validate user data');
        }

        if (emailDuplicates > 0) {
            throw new Error('User with this Email already exists');
        }

        if (phoneDuplicates > 0) {
            throw new Error('User with this Phone number already exists');
        }

        if (!id) {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(data.password, salt);
            data.password = hash;
        }

        return data;
    }
}
