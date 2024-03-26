import { User } from '../Models/User'
import { UserRepository } from '../Repositories/UserRepository'
import { CrudServiceInterface } from './CrudServiceInterface'
import { AbstractModelService } from './AbstractModelService'
import bcrypt from 'bcrypt'
import { ModelNotFoundByFilterException } from '../Exceptions/ModelNotFoundByFilterException'
import { CrudServiceException } from '../Exceptions/CrudServiceException'
import { ModelDuplicateException } from '../Exceptions/ModelDuplicateException'

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
            throw new ModelNotFoundByFilterException({ email: email });
        }

        return user;
    }

    protected async validateModelData(data: Record<string, any>, id: number | null = null): Promise<Record<string, any>> {
        let emailDuplicates, phoneDuplicates;

        try {
            emailDuplicates = await this.repository.countBy('email', data.email, id);
            phoneDuplicates = await this.repository.countBy('phone_number', data.phone_number, id);
        } catch (e) {
            throw new CrudServiceException('Unable to validate user data');
        }

        if (emailDuplicates > 0) {
            throw new ModelDuplicateException('email', data.email);
        }

        if (phoneDuplicates > 0) {
            throw new ModelDuplicateException('phone_number', data.phone_number);
        }

        if (!id) {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(data.password, salt);
            data.password = hash;
        }

        return data;
    }
}
