import { Request, Response, Router } from 'express'
import { UserService } from '../Services/UserService'
import { AbstractController } from './AbstractController'
import asyncHandler from 'express-async-handler'

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
    }

    private getAllUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const users = (await this.userService.index()).map(user => user.toJson());
        this.okResponse(res, users);
    });
}
