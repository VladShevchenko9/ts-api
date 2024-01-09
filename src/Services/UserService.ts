import { User } from '../Models/User'
import { Validator } from './Validator'
import { ModelSetter } from './ModelSetter'
import { UserRepository } from '../Repositories/UserRepository'

export class UserService {
    private userRepo: UserRepository;

    constructor(userRepo: UserRepository) {
        this.userRepo = userRepo;
    }

    public async index(): Promise<User[]> {
        let users = [];

        try {
            users = await this.userRepo.getAll();
        } catch (e) {
            throw new Error('Unable to retrieve user data');
        }

        return users.map(record => ModelSetter.setModelData(record, new User()) as User);
    }

    public async show(id: number): Promise<User> {
        let user;

        try {
            user = await this.userRepo.find(id);
        } catch (e) {
            throw new Error('User does not exist');
        }

        return ModelSetter.setModelData(user, new User()) as User;
    }

    public async store(data: Record<string, any>): Promise<User> {
        await this.validateUserData(data);

        try {
            await this.userRepo.create(data);
        } catch (e) {
            throw new Error('Unable to create a user');
        }

        let user;

        try {
            user = await this.userRepo.findBy({ email: data.email });
        } catch (e) {
            throw new Error('Unable to retrieve user data');
        }

        return ModelSetter.setModelData(user, new User()) as User;
    }

    public async update(id: number, data: Record<string, string>): Promise<User> {
        await this.show(id);
        await this.validateUserData(data, id);

        try {
            await this.userRepo.update(id, data);
        } catch (e) {
            throw new Error('User can`t be updated');
        }

        return await this.show(id);
    }

    public async delete(id: number): Promise<boolean> {
        await this.show(id);

        try {
            await this.userRepo.delete(id);
        } catch (e) {
            return false;
        }

        return true;
    }

    private async validateUserData(data: Record<string, any>, id: number | null = null): Promise<void> {
        Validator.checkRequiredFields(data, User.requiredFields);
        let emailDuplicates, phoneDuplicates;

        try {
            emailDuplicates = await this.userRepo.countDuplicatesBy('email', data.email, id);
            phoneDuplicates = await this.userRepo.countDuplicatesBy('phone_number', data.phone_number, id);
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
}
