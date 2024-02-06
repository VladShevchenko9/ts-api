import { Post } from '../Models/Post'
import { ModelSetter } from './ModelSetter'
import { CrudServiceInterface } from './CrudServiceInterface'
import { AbstractModelService } from './AbstractModelService'
import { PostRepository } from '../Repositories/PostRepository'

export class PostService extends AbstractModelService implements CrudServiceInterface {
    protected repository: PostRepository;

    constructor(postRepo: PostRepository) {
        super(postRepo);
    }

    protected makeModel(record: Record<string, any>): Post {
        return ModelSetter.setModelData(record, new Post()) as Post;
    };
}
