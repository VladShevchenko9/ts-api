import { Router } from 'express'
import { PostService } from '../Services/PostService'
import { AbstractController } from './AbstractController'
import { PostRequest } from '../Requests/PostRequest'

export class PostsController extends AbstractController {
    public router: Router;

    constructor(postService: PostService, router: Router, request: PostRequest) {
        super(postService, router, request);
        this.intializeRoutes();
    }

    public intializeRoutes(): void {
        this.router.get('/posts', this.getAllModels);
        this.router.post('/posts', this.createModel);
        this.router.get('/posts/:id', this.getModel);
        this.router.put('/posts/:id', this.updateModel);
        this.router.delete('/posts/:id', this.deleteModel);
    }
}
