import { AbstractRepository } from '../Repositories/AbstractRepository'
import { CrudServiceInterface } from './CrudServiceInterface'
import { AbstractModel } from '../Models/AbstractModel'
import { CommonIndexRequest } from '../Requests/CommonIndexRequest'
import { CrudServiceException } from '../Exceptions/CrudServiceException'

export abstract class AbstractModelService implements CrudServiceInterface {
    protected repository: AbstractRepository;

    constructor(modelRepo: AbstractRepository) {
        this.repository = modelRepo;
    }

    public async index(queryData: CommonIndexRequest): Promise<AbstractModel[]> {
        let models = [];

        try {
            models = await this.repository.getAll(queryData);
        } catch (e) {
            throw new CrudServiceException('Unable to retrieve model data');
        }

        return models;
    }

    public async show(id: number): Promise<AbstractModel> {
        return await this.repository.find(id);
    }

    public async store(data: Record<string, any>): Promise<AbstractModel> {
        data = await this.validateModelData(data);
        let modelId: number = 0;

        try {
            modelId = await this.repository.create(data);
        } catch (e) {
            throw new CrudServiceException('Unable to create a model');
        }

        return await this.show(modelId);
    }

    public async update(id: number, data: Record<string, any>): Promise<AbstractModel> {
        await this.show(id);
        data = await this.validateModelData(data, id);

        try {
            await this.repository.update(id, data);
        } catch (e) {
            throw new CrudServiceException('Model can`t be updated');
        }

        return await this.show(id);
    }

    public async delete(id: number): Promise<boolean> {
        await this.show(id);

        try {
            await this.repository.delete(id);
        } catch (e) {
            return false;
        }

        return true;
    }

    protected abstract validateModelData(data: Record<string, any>, id?: number): Promise<Record<string, any>>;
}
