import { Router } from 'express'
import { AbstractController } from './AbstractController'

export class HomeController extends AbstractController {
    constructor(router: Router) {
        super(router);
        this.intializeRoutes();
    }

    public intializeRoutes(): void {
        this.router.get('/', this.homePage);
    }

    private homePage = (req, res) => {
        this.okResponse(res, `
            <a href="/users">Users</a>
            <br>
            <a href="/posts">Posts</a>
        `);
    };
}
