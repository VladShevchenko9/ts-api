import { AbstractModel } from '../Models/AbstractModel'
import { CommonIndexRequest } from '../Requests/CommonIndexRequest'

export interface CrudServiceInterface {
    index(queryData: CommonIndexRequest): Promise<AbstractModel[]>;

    show(id: number): Promise<AbstractModel>;

    store(data: Record<string, any>): Promise<AbstractModel>;

    update(id: number, data: Record<string, any>): Promise<AbstractModel>;

    delete(id: number): Promise<boolean>;
}
