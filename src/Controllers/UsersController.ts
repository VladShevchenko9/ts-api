import { Response, Router, Request } from 'express'
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
import { AuthMiddleware } from '../Middleware/AuthMiddleware'
import { UserUpdatePasswordRequest } from '../Requests/UserUpdatePasswordRequest'
import { User } from '../Models/User'
import { UserMiddleware } from '../Middleware/UserMiddleware'
import { TokenFunctions } from '../Services/TokenFunctions'
import { Log } from '../Events/Log'

export class UsersController extends AbstractController {
    public router: Router;
    protected service: UserService;
    private readonly invalidPasswordMessage: string = 'The provided password is invalid.';
    private readonly updatePasswordErrorMessage: string = 'Unable to update user password.';

    constructor(userService: UserService, router: Router) {
        super(userService, router);
        this.intializeRoutes();
    }

    public intializeRoutes(): void {
        this.router.use('/users', [AuthMiddleware.authenticate]);
        this.router.get('/users', this.getAllModels);
        this.router.get('/users/:id', this.getModel);
        this.router.patch('/users/update-password/:id', [UserMiddleware.checkUserPermission], this.updatePassword);
        this.router.patch('/users/:id', [UserMiddleware.checkUserPermission], this.updateModel);
        this.router.delete('/users/:id', [UserMiddleware.checkUserPermission], this.deleteModel);
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

    protected updatePassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const request = new UserUpdatePasswordRequest();
        const userId = parseInt(req.params.id);
        let user: User;

        request.oldPassword = req.body.oldPassword;
        request.newPassword = req.body.newPassword;
        request.confirmationPassword = req.body.confirmationPassword;

        try {
            await validateOrReject(request);
        } catch (errors) {
            this.errorResponse(res, 400, errors);

            return;
        }

        try {
            user = await this.service.show(userId) as User;
        } catch (error) {
            this.errorResponse(res, 404, error);

            return;
        }

        if (!bcrypt.compareSync(request.oldPassword, user.getAttrValue('password'))) {
            this.errorResponse(res, 409, this.invalidPasswordMessage);

            return;
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(request.newPassword, salt);

        const data = user.toJson();
        data.password = hash;
        delete data.id;

        try {
            user = await this.service.update(userId, data) as User;
        } catch (error) {
            this.errorResponse(res, 422, this.updatePasswordErrorMessage);

            return;
        }

        await this.okResponse(res);
    });

    protected login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const request = new UserLoginRequest();
        request.email = req.body.email;
        request.password = req.body.password;
        let user;

        try {
            await validateOrReject(request);
        } catch (errors) {
            this.errorResponse(res, 400, errors);
            return;
        }

        try {
            user = await this.service.getUserByEmail(request.email);
        } catch (error) {
            this.errorResponse(res, 404, error);
            return;
        }

        if (!bcrypt.compareSync(request.password, user.getAttrValue('password'))) {
            this.errorResponse(res, 409, this.invalidPasswordMessage);
            return;
        }

        const token = TokenFunctions.generateToken(user);

        Container.createInstance<Log>(Log.name).emitEvent(`user ${request.email} just logged in`);

        await this.okResponse(res, token);
    });
}
