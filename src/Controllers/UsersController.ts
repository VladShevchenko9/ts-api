import { Request, Response, Router } from 'express'
import { UserService } from '../Services/UserService'
import { AbstractController } from './AbstractController'
import asyncHandler from 'express-async-handler'
import { Validator } from '../Services/Validator'
import { User } from '../Models/User'
import { TypeCaster } from '../Services/TypeCaster'

export class UsersController extends AbstractController {
    private userService: UserService;
    public router: Router;

    constructor(userService: UserService, router: Router) {
        super(router);
        this.userService = userService;
        this.intializeRoutes();
    }

    public intializeRoutes(): void {
        this.router.get('/users', this.getAllUsers);
        this.router.post('/users', this.createUser);
        this.router.get('/users/:id', this.getUser);
        this.router.put('/users/:id', this.updateUser);
        this.router.delete('/users/:id', this.deleteUser);
    }

    private getAllUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const users = (await this.userService.index()).map(user => user.toJson());
        this.okResponse(res, users);
    });

    private getUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const userId = parseInt(req.params.id);
        let user;

        try {
            user = await this.userService.show(userId);
        } catch (e) {
            this.errorResponse(res, 404, e.message);
            return;
        }

        this.okResponse(res, user.toJson());
    });

    private createUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        let user;
        let data = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            phone_number: req.body.phone_number
        }

        try {
            Validator.checkRequiredFields(data, User.requiredFields);
            TypeCaster.objValuesToString(data);
            user = await this.userService.store(data);
        } catch (e) {
            this.errorResponse(res, 400, e.message);
            return;
        }

        this.okResponse(res, user.toJson());
    });

    private updateUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const userId = parseInt(req.params.id);
        let user;
        let data = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            phone_number: req.body.phone_number
        }

        try {
            Validator.checkRequiredFields(data, User.requiredFields);
            TypeCaster.objValuesToString(data);
            user = await this.userService.update(userId, data);
        } catch (e) {
            this.errorResponse(res, 400, e.message);
            return;
        }

        this.okResponse(res, user.toJson());
    });

    private deleteUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const userId = parseInt(req.params.id);

        try {
            await this.userService.delete(userId);
        } catch (e) {
            this.errorResponse(res, 400, e.message);
            return;
        }

        this.okResponse(res, { success: true });
    });
}
