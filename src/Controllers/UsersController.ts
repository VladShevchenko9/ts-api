import { Response, Router, Request, NextFunction } from 'express'
import { UserService } from '../Services/UserService'
import { AbstractController } from './AbstractController'
import { UserUpdateRequest } from '../Requests/UserUpdateRequest'
import { UserFilter } from '../Requests/Filters/UserFilter'
import { UserTransformer } from '../ResponseTransformers/UserTransformer'
import { Container } from '../Container'
import { PostRepository } from '../Repositories/PostRepository'
import { UserCreateRequest } from '../Requests/UserCreateRequest'
import asyncHandler from 'express-async-handler'
import { UserLoginRequest } from '../Requests/UserLoginRequest'
import { validateOrReject } from 'class-validator'
import bcrypt from 'bcrypt'
import { SessionFunctions } from '../Services/SessionFunctions'
import { AuthMiddleware } from '../Middleware/AuthMiddleware'

export class UsersController extends AbstractController {
    public router: Router;
    protected service: UserService;

    constructor(userService: UserService, router: Router) {
        super(userService, router);
        this.intializeRoutes();
    }

    public intializeRoutes(): void {
        this.router.use('/users', [AuthMiddleware.checkSessionUser]);
        this.router.get('/users', this.getAllModels);
        this.router.get('/users/:id', this.getModel);
        this.router.patch('/users/:id', this.updateModel);
        this.router.delete('/users/:id', this.deleteModel);
        this.router.post('/login', this.login);
        this.router.post('/register', this.createModel);
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

    protected login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const request = new UserLoginRequest();
        request.email = req.body.email;
        request.password = req.body.password;
        let user;

        try {
            await validateOrReject(request);
        } catch (errors) {
            this.errorResponse(res, 400, 'Invalid data');
            return;
        }

        try {
            user = await this.service.getUserByEmail(request.email);
        } catch (error) {
            this.errorResponse(res, 404, error.message);
            return;
        }

        if (!bcrypt.compareSync(request.password, user.getAttrValue('password'))) {
            this.errorResponse(res, 409, 'Invalid PASSWORD');
            return;
        }

        SessionFunctions.setUser(req, user);

        return this.okResponse(res);
    });
}
