import { AbstractModel } from '../Models/AbstractModel'

export abstract class AbstractTransformer {
    public transform(modelData: AbstractModel | AbstractModel[]): Record<string, any> | Record<string, any>[] {
        if (Array.isArray(modelData)) {
            modelData.map(model => model.toJson());

            return modelData;
        }

        return modelData.toJson();
    }
}
