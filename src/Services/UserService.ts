import { User } from '../Models/User'
import { ModelSetter } from './ModelSetter'
import { UserRepository } from '../Repositories/UserRepository'
import { CrudServiceInterface } from './CrudServiceInterface'
import { AbstractModelService } from './AbstractModelService'

export class UserService extends AbstractModelService implements CrudServiceInterface {
    protected repository: UserRepository;

    constructor(userRepo: UserRepository) {
        super(userRepo);
    }

    protected async validateModelData(data: Record<string, any>, id: number | null = null): Promise<void> {
        let emailDuplicates, phoneDuplicates;

        try {
            emailDuplicates = await this.repository.countDuplicatesBy('email', data.email, id);
            phoneDuplicates = await this.repository.countDuplicatesBy('phone_number', data.phone_number, id);
        } catch (e) {
            throw new Error('Unable to validate user data');
        }

        if (emailDuplicates > 0) {
            throw new Error('User with this Email already exists');
        }

        if (phoneDuplicates > 0) {
            throw new Error('User with this Phone number already exists');
        }
    }

    protected makeModel(record: Record<string, any>): User {
        return ModelSetter.setModelData(record, new User()) as User;
    };
}
