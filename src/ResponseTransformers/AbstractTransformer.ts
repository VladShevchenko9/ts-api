import { AbstractModel } from '../Models/AbstractModel'

export abstract class AbstractTransformer {
    public transform(modelData: AbstractModel | AbstractModel[]): Record<string, any> | Record<string, any>[] {
        if (Array.isArray(modelData)) {
            return modelData.map(model => this.transform(model));
        }

        return this.transformSingleRecord(modelData);
    }

    protected transformSingleRecord(modelData: AbstractModel): Record<string, any> {
        return modelData.toJson();
    }
}
