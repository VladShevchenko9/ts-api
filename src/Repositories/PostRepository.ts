import { AbstractRepository } from './AbstractRepository'
import { Post } from '../Models/Post'
import { AbstractModel } from '../Models/AbstractModel'

export class PostRepository extends AbstractRepository {
    get table(): string {
        return Post.table;
    }

    public async getLatestUserPosts(userId: number): Promise<Post[]> {
        const postsTotal = 3;
        const records = await this.qb.select().from(this.table).where('user_id', '=', userId).orderBy('id', 'DESC').limit(postsTotal);
        return records.map(data => (this.makeModel(data)) as AbstractModel) as Post[];
    }

    protected getModelClass(): new () => Post {
        return Post;
    }
}
