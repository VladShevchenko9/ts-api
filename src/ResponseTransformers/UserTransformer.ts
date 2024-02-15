import { User } from '../Models/User'
import { PostRepository } from '../Repositories/PostRepository'
// import { CommonIndexRequest } from '../Requests/CommonIndexRequest'
// import { PostFilter } from '../Requests/Filters/PostFilter'
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
        transformData['latestPosts'] = await this.repository.getLatestUserPosts(transformData['id']);
        // @todo: remove when I understand what is going on here :) 
        // const filter = new PostFilter();
        // filter.user_id = transformData['id'];
        // const query = new CommonIndexRequest(1, 3, filter);
        // transformData['latestPosts'] = await this.repository.getAll(query);

        return transformData;
    }
}
