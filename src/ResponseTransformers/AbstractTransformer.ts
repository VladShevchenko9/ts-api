import { AbstractModel } from '../Models/AbstractModel'

export abstract class AbstractTransformer {
    public async transform(modelData: AbstractModel | AbstractModel[]): Promise<Record<string, any> | Record<string, any>[]> {
        if (Array.isArray(modelData)) {
            return Promise.all(modelData.map(async (model) => await this.transformSingleRecord(model)));
        }

        return await this.transformSingleRecord(modelData);
    }

    protected async transformSingleRecord(modelData: AbstractModel): Promise<Record<string, any>> {
        return modelData.toJson();
    }
}
