import { AbstractModel } from '../Models/AbstractModel'

export interface CrudServiceInterface {
    index(page?: number, limit?: number): Promise<AbstractModel[]>;

    show(id: number): Promise<AbstractModel>;

    store(data: Record<string, any>): Promise<AbstractModel>;

    update(id: number, data: Record<string, any>): Promise<AbstractModel>;

    delete(id: number): Promise<boolean>;
}
