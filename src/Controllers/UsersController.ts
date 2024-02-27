import { Router } from 'express'
import { UserService } from '../Services/UserService'
import { AbstractController } from './AbstractController'
import { UserUpdateRequest } from '../Requests/UserUpdateRequest'
import { UserFilter } from '../Requests/Filters/UserFilter'
import { UserTransformer } from '../ResponseTransformers/UserTransformer'
import { Container } from '../Container'
import { PostRepository } from '../Repositories/PostRepository'
import { UserCreateRequest } from '../Requests/UserCreateRequest'

export class UsersController extends AbstractController {
    public router: Router;

    constructor(userService: UserService, router: Router) {
        super(userService, router);
        this.intializeRoutes();
    }

    public intializeRoutes(): void {
        this.router.get('/users', this.getAllModels);
        this.router.post('/users', this.createModel);
        this.router.get('/users/:id', this.getModel);
        this.router.put('/users/:id', this.updateModel);
        this.router.delete('/users/:id', this.deleteModel);
    }

    protected getFilterData(): UserFilter {
        return new UserFilter();
    }

    protected getTransformer(): UserTransformer {
        const postRepository = Container.createInstance<PostRepository>(PostRepository.name);
        return Container.createInstance<UserTransformer>(UserTransformer.name, postRepository);
    }

    protected getCreateRequest(): UserCreateRequest {
        return new UserCreateRequest();
    }

    protected getUpdateRequest(): UserUpdateRequest {
        return new UserUpdateRequest();
    }


}
