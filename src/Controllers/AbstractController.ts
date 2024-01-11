import { Response, Router } from 'express'

export abstract class AbstractController {
    public router: Router;

    constructor(router: Router) {
        this.router = router;
    }

    protected errorResponse(res: Response, code: number, message: string): void {
        res.status(code).send(message);
    }

    protected okResponse(res: Response, data: Record<string, any> | Record<string, any>[] | string): void {
        res.status(200).send(data);
    }

    public abstract intializeRoutes(): void;
}
