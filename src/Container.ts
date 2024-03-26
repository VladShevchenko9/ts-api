import { UserRepository } from './Repositories/UserRepository'
import { PostRepository } from './Repositories/PostRepository'
import { UserService } from './Services/UserService'
import { PostService } from './Services/PostService'
import { UsersController } from './Controllers/UsersController'
import { PostsController } from './Controllers/PostsController'
import { UserTransformer } from './ResponseTransformers/UserTransformer'
import { PostTransformer } from './ResponseTransformers/PostTransformer'
import { RoleRepository } from './Repositories/RoleRepository'
import { KnexQueryBuilder } from './Services/KnexQueryBuilder'
import { UnregisteredClassException } from './Exceptions/UnregisteredClassException'

export class Container {
    private static readonly appClasses: Record<string, any> = {
        [KnexQueryBuilder.name]: KnexQueryBuilder,
        [UserRepository.name]: UserRepository,
        [PostRepository.name]: PostRepository,
        [RoleRepository.name]: RoleRepository,
        [UserService.name]: UserService,
        [PostService.name]: PostService,
        [UsersController.name]: UsersController,
        [PostsController.name]: PostsController,
        [UserTransformer.name]: UserTransformer,
        [PostTransformer.name]: PostTransformer,
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
                throw new UnregisteredClassException(className);
            }
        }

        return this.instances[className];
    }
}
