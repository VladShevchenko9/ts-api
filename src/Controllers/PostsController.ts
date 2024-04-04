import { Response, Router, Request } from 'express'
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
import asyncHandler from 'express-async-handler'
import { UserCreatedPostEvent } from '../Events/UserCreatedPostEvent'

export class PostsController extends AbstractController {
    public router: Router;

    constructor(postService: PostService, router: Router) {
        super(postService, router);
        this.intializeRoutes();
    }

    public intializeRoutes(): void {
        this.router.use('/posts', [AuthMiddleware.authenticate]);
        this.router.get('/posts', this.getAllModels);
        this.router.post('/posts', [UserMiddleware.checkUserPostCreatePermission], this.createModel);
        this.router.get('/posts/:id', this.getModel);
        this.router.put('/posts/:id', [UserMiddleware.checkUserPostCreatePermission, UserMiddleware.checkUserPostUpdateOrDeletePermission], this.updateModel);
        this.router.delete('/posts/:id', [UserMiddleware.checkUserPostUpdateOrDeletePermission], this.deleteModel);
    }

    protected createModel = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const model = await this.createModelBase(req, res);

        if (model) {
            Container.createInstance<UserCreatedPostEvent>(UserCreatedPostEvent.name).emitEvent(model.getAttrValue('user_id'));
            await this.okResponse(res, model);
        }
    });

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
