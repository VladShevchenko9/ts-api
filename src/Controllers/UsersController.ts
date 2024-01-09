import { Request, Response } from 'express'
import { UserService } from '../Services/UserService'
import { AbstractController } from './AbstractController'

export class UsersController extends AbstractController {
    private userService: UserService;

    constructor(userService: UserService) {
        super();
        this.userService = userService;
    }

    public async index(req: Request, res: Response): Promise<void> {
        const users = (await this.userService.index()).map(user => user.toJson());
        this.okResponse(res, users);
    }
}
