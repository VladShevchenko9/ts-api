import { Router } from 'express'
import { PostService } from '../Services/PostService'
import { AbstractController } from './AbstractController'
import { PostUpdateRequest } from '../Requests/PostUpdateRequest'
import { PostFilter } from '../Requests/Filters/PostFilter'
import { PostTransformer } from '../ResponseTransformers/PostTransformer'
import { Container } from '../Container'
import { UserRepository } from '../Repositories/UserRepository'
import { PostCreateRequest } from '../Requests/PostCreateRequest'
import { AuthMiddleware } from '../Middleware/AuthMiddleware'
import { UserMiddleware } from '../Middleware/UserMiddleware'

export class PostsController extends AbstractController {
    public router: Router;

    constructor(postService: PostService, router: Router) {
        super(postService, router);
        this.intializeRoutes();
    }

    public intializeRoutes(): void {
        this.router.use('/posts', [AuthMiddleware.checkSessionUser]);
        this.router.get('/posts', this.getAllModels);
        this.router.post('/posts', [UserMiddleware.checkUserPostCreatePermission], this.createModel);
        this.router.get('/posts/:id', this.getModel);
        this.router.put('/posts/:id', [UserMiddleware.checkUserPostCreatePermission, UserMiddleware.checkUserPostUpdateOrDeletePermission], this.updateModel);
        this.router.delete('/posts/:id', [UserMiddleware.checkUserPostUpdateOrDeletePermission], this.deleteModel);
    }

    protected getFilterData(): PostFilter {
        return new PostFilter();
    }

    protected getTransformer(): PostTransformer {
        const userRepository = Container.createInstance<UserRepository>(UserRepository.name);
        return Container.createInstance<PostTransformer>(PostTransformer.name, userRepository);
    }

    protected getCreateRequest(): PostCreateRequest {
        return new PostCreateRequest();
    }

    protected getUpdateRequest(): PostUpdateRequest {
        return new PostUpdateRequest();
    }
}
