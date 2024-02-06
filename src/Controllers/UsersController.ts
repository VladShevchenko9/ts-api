import { Router } from 'express'
import { UserService } from '../Services/UserService'
import { AbstractController } from './AbstractController'
import { UserRequest } from '../Requests/UserRequest'
import { UserFilter } from '../Requests/Filters/UserFilter'

export class UsersController extends AbstractController {
    public router: Router;

    constructor(userService: UserService, router: Router, request: UserRequest) {
        super(userService, router, request);
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
}
