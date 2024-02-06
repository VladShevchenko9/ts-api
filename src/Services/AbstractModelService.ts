import { AbstractRepository } from '../Repositories/AbstractRepository'
import { CrudServiceInterface } from './CrudServiceInterface'
import { AbstractModel } from '../Models/AbstractModel'
import { CommonQuery } from '../Structures/CommonQuery'

export abstract class AbstractModelService implements CrudServiceInterface {
    protected repository: AbstractRepository;

    constructor(modelRepo: AbstractRepository) {
        this.repository = modelRepo;
    }

    public async index(
        queryData: CommonQuery
    ): Promise<AbstractModel[]> {
        let models = [];

        try {
            models = await this.repository.getAll(queryData);
        } catch (e) {
            throw new Error('Unable to retrieve model data');
        }

        return models.map(record => this.makeModel(record));
    }

    public async show(id: number): Promise<AbstractModel> {
        let model;

        try {
            model = await this.repository.find(id);
        } catch (e) {
            throw new Error('Model does not exist');
        }

        return this.makeModel(model);
    }

    public async store(data: Record<string, any>): Promise<AbstractModel> {
        await this.validateModelData(data);
        let modelId: number = 0;

        try {
            modelId = await this.repository.create(data);
        } catch (e) {
            throw new Error('Unable to create a model');
        };
        return this.show(modelId);
    }

    public async update(id: number, data: Record<string, any>): Promise<AbstractModel> {
        await this.show(id);
        await this.validateModelData(data, id);

        try {
            await this.repository.update(id, data);
        } catch (e) {
            throw new Error('Model can`t be updated');
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

    protected validateModelData(data: Record<string, any>, id?: number): Promise<void> {
        return new Promise(() => { });
    }
    protected abstract makeModel(record: Record<string, any>): AbstractModel;
}
