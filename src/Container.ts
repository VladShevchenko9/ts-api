import { DB } from './Services/DB'
import { QueryBuilder } from './Services/QueryBuilder'
import { UserRepository } from './Repositories/UserRepository'
import { PostRepository } from './Repositories/PostRepository'
import { UserService } from './Services/UserService'
import { PostService } from './Services/PostService'
import { UsersController } from './Controllers/UsersController'
import { HomeController } from './Controllers/HomeController'

export class Container {
    private static readonly appClasses: Record<string, any> = {
        [DB.name]: DB,
        [QueryBuilder.name]: QueryBuilder,
        [UserRepository.name]: UserRepository,
        [PostRepository.name]: PostRepository,
        [UserService.name]: UserService,
        [PostService.name]: PostService,
        [UsersController.name]: UsersController,
        [HomeController.name]: HomeController,
    };

    private static instances: { [key: string]: any } = {};
    private static classRegistry: { [key: string]: new (...args: any[]) => any } = {};
    private static registredClasses: string[] = [];

    private static registerClass(className: string, constructor: new (...args: any[]) => any): void {
        this.classRegistry[className] = constructor;
    }

    public static createInstance<T>(className: string, ...args: any[]): T {
        if (!this.registredClasses.includes(className)) {
            this.registerClass(className, this.appClasses[className]);
            this.registredClasses.push(className);
        }

        if (!this.instances[className]) {
            const constructor = this.classRegistry[className];

            if (constructor) {
                this.instances[className] = new constructor(...args);
            } else {
                throw new Error(`Class "${className}" is not registered.`);
            }
        }

        return this.instances[className];
    }
}
