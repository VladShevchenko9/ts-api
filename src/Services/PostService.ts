import { CrudServiceInterface } from './CrudServiceInterface'
import { AbstractModelService } from './AbstractModelService'
import { PostRepository } from '../Repositories/PostRepository'
import { User } from '../Models/User'

export class PostService extends AbstractModelService implements CrudServiceInterface {
    protected repository: PostRepository;

    constructor(postRepo: PostRepository) {
        super(postRepo);
    }

    protected async validateModelData(data: Record<string, any>, id?: number): Promise<Record<string, any>> {
        const userId = Number(data.user_id);

        const idExist = await this.repository.countBy('id', userId, null, User.table);

        if (!idExist) {
            throw new Error(`Unable to find a user with id: ${userId}`);
        }

        return data;
    }
}
