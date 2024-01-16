import { Post } from '../Models/Post'
import { ModelSetter } from './ModelSetter'
import { PostRepository } from '../Repositories/PostRepository'

export class PostService {
    private postRepo: PostRepository;

    constructor(postRepo: PostRepository) {
        this.postRepo = postRepo;
    }

    public async index(): Promise<Post[]> {
        let posts;

        try {
            posts = await this.postRepo.getAll();
        } catch (e) {
            throw new Error('Unable to retrieve post data');
        }

        return posts.map(record => ModelSetter.setModelData(record, new Post()) as Post);
    }

    public async show(id: number): Promise<Post> {
        let post;

        try {
            post = await this.postRepo.find(id);
        } catch (e) {
            throw new Error('Post does not exist');
        }

        return ModelSetter.setModelData(post, new Post()) as Post;
    }

    public async store(data: Record<string, any>): Promise<Post> {
        let postId;

        try {
            postId = await this.postRepo.create(data);
        } catch (e) {
            throw new Error('Unable to create a post');
        }

        return await this.show(postId);
    }

    public async update(id: number, data: Record<string, any>): Promise<Post> {
        await this.show(id);

        try {
            await this.postRepo.update(id, data);
        } catch (e) {
            throw new Error('Post can`t be updated');
        }

        return await this.show(id);
    }

    public async delete(id: number): Promise<boolean> {
        await this.show(id);

        try {
            await this.postRepo.delete(id);
        } catch (e) {
            return false;
        }

        return true;
    }
}
