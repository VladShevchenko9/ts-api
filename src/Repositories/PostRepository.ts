import { AbstractRepository } from './AbstractRepository'
import { Post } from '../Models/Post'

export class PostRepository extends AbstractRepository {
    get table(): string {
        return Post.table;
    }
}
