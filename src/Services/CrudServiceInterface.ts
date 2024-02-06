import { AbstractModel } from '../Models/AbstractModel'
import { CommonQuery } from '../Structures/CommonQuery'

export interface CrudServiceInterface {
    index(queryData: CommonQuery): Promise<AbstractModel[]>;

    show(id: number): Promise<AbstractModel>;

    store(data: Record<string, any>): Promise<AbstractModel>;

    update(id: number, data: Record<string, any>): Promise<AbstractModel>;

    delete(id: number): Promise<boolean>;
}
