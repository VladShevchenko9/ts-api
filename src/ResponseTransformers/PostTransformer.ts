import { Post } from '../Models/Post'
import { UserRepository } from '../Repositories/UserRepository'
import { AbstractTransformer } from './AbstractTransformer'

export class PostTransformer extends AbstractTransformer {
    protected repository: UserRepository;

    constructor(userRepo: UserRepository) {
        super();
        this.repository = userRepo;
    }

    protected async transformSingleRecord(modelData: Post): Promise<Record<string, any>> {
        let transformData = await super.transformSingleRecord(modelData);
        const user = await this.repository.find(transformData['user_id']);
        transformData['user'] = user.toJson();

        return transformData;
    }
}
