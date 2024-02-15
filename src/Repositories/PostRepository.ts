import { AbstractRepository } from './AbstractRepository'
import { Post } from '../Models/Post'

export class PostRepository extends AbstractRepository {
    get table(): string {
        return Post.table;
    }

    public async getLatestUserPosts(userId: number): Promise<Record<string, any>[]> {
        const postsTotal = 3;
        const sql = this.qb.select().from(this.table).where('user_id', '=', userId).orderBy('id', 'DESC').limit(postsTotal).sql;

        return await this.db.executeQuery(sql) || [];
    }
}
