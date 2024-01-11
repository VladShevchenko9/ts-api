import express from 'express'
import { AbstractController } from './Controllers/AbstractController'

export class App {
    public app: express.Application;
    public port: number;

    constructor(controllers: AbstractController[], port: number = 3000) {
        this.app = express();
        this.port = port;

        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }

    private initializeMiddlewares(): void {
        this.app.use(express.json());
    }

    private initializeControllers(controllers: AbstractController[]): void {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }

    public listen(): void {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}
