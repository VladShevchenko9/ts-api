import {DB} from './Services/DB'
import {QueryBuilder} from './Services/QueryBuilder'
import {UserRepository} from './Repositories/UserRepository'
import {PostRepository} from './Repositories/PostRepository'
import {UserService} from './Services/UserService'
import {PostService} from './Services/PostServiсe'

export class Container {
    private static readonly appClasses: Record<string, any> = {
        [DB.name]: DB,
        [QueryBuilder.name]: QueryBuilder,
        [UserRepository.name]: UserRepository,
        [PostRepository.name]: PostRepository,
        [UserService.name]: UserService,
        [PostService.name]: PostService
    };

    private static classesRegistered: boolean = false;
    private static instances: { [key: string]: any } = {};
    private static classRegistry: { [key: string]: new (...args: any[]) => any } = {};

    private static registerClass(className: string, constructor: new (...args: any[]) => any): void {
        this.classRegistry[className] = constructor;
    }

    public static createInstance<T>(className: string, ...args: any[]): T {
        if (!this.classesRegistered) {
            Object.keys(this.appClasses).map(name => {
                this.registerClass(name, this.appClasses[name]);
            });

            this.classesRegistered = true;
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
