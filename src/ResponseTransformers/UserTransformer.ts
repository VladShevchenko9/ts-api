import { User } from '../Models/User'
import { PostRepository } from '../Repositories/PostRepository'
import { AbstractTransformer } from './AbstractTransformer'

export class UserTransformer extends AbstractTransformer {
    protected repository: PostRepository;

    constructor(repository: PostRepository) {
        super();
        this.repository = repository;
    }

    protected async transformSingleRecord(modelData: User): Promise<Record<string, any>> {
        let transformData = await super.transformSingleRecord(modelData);
        transformData['isGmailUser'] = transformData['email'].endsWith('@gmail.com');
        transformData['latestPosts'] = (await this.repository.getLatestUserPosts(transformData['id'])).map(post => post.toJson());

        return transformData;
    }
}
