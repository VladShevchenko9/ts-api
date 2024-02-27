import { Post } from '../Models/Post'
import { User } from '../Models/User'
import { UserRepository } from '../Repositories/UserRepository'
import { ModelSetter } from '../Services/ModelSetter'
import { AbstractTransformer } from './AbstractTransformer'

export class PostTransformer extends AbstractTransformer {
    protected repository: UserRepository;

    constructor(userRepo: UserRepository) {
        super();
        this.repository = userRepo;
    }

    protected async transformSingleRecord(modelData: Post): Promise<Record<string, any>> {
        let transformData = await super.transformSingleRecord(modelData);
        const userRecord = await this.repository.find(transformData['user_id']);
        const user = ModelSetter.setModelData(userRecord, new User()) as User;
        transformData['user'] = user.toJson();

        return transformData;
    }
}
