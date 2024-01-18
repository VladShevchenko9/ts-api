import { Request, Response, Router } from 'express'
import { PostService } from '../Services/PostService'
import { AbstractController } from './AbstractController'
import asyncHandler from 'express-async-handler'
import { PostRequest } from '../Requests/PostRequest'
import { Post } from '../Models/Post'

export class PostsController extends AbstractController {
    private postService: PostService;
    public router: Router;

    constructor(postService: PostService, router: Router) {
        super(router);
        this.postService = postService;
        this.intializeRoutes();
    }

    public intializeRoutes(): void {
        this.router.get('/posts', this.getAllPosts);
        this.router.post('/posts', this.createPost);
        this.router.get('/posts/:id', this.getPost);
        this.router.put('/posts/:id', this.updatePost);
        this.router.delete('/posts/:id', this.deletePost);
    }

    private getAllPosts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const posts = (await this.postService.index()).map(post => post.toJson());
        this.okResponse(res, posts);
    });

    private getPost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const postId = parseInt(req.params.id);
        let post;

        try {
            post = await this.postService.show(postId);
        } catch (e) {
            this.errorResponse(res, 404, e.message);
            return;
        }

        this.okResponse(res, post.toJson());
    });

    private createPost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        let post;
        const request = new PostRequest();
        const data = request.getRequestData(Post.requiredFields, req);

        try {
            request.validate(data);
            post = await this.postService.store(data);
        } catch (e) {
            this.errorResponse(res, 400, e.message);
            return;
        }

        this.okResponse(res, post.toJson());
    });

    private updatePost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const postId = parseInt(req.params.id);
        let post;
        const request = new PostRequest();
        const data = request.getRequestData(Post.requiredFields, req);

        try {
            request.validate(data);
            post = await this.postService.update(postId, data);
        } catch (e) {
            this.errorResponse(res, 400, e.message);
            return;
        }

        this.okResponse(res, post.toJson());
    });

    private deletePost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const postId = parseInt(req.params.id);

        try {
            await this.postService.delete(postId);
        } catch (e) {
            this.errorResponse(res, 400, e.message);
            return;
        }

        this.okResponse(res, { success: true });
    });
}