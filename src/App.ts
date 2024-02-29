import express from 'express'
import { AbstractController } from './Controllers/AbstractController'
import session from 'express-session'
import 'dotenv/config'

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
        const sess = {
            secret: process.env.SESSION_SECRET,
            cookie: {},
            resave: false,
            saveUninitialized: true,
        };
        this.app.use(session(sess));
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
