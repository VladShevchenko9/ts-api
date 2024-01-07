import {AbstractModel} from '../Models/AbstractModel'

export class ModelSetter {
    public static setModelData(data: Record<string, any>, model: AbstractModel): AbstractModel {
        model.getAttrList().map(attribute => {
            if (data.hasOwnProperty(attribute)) {
                model.setAttrValue(attribute, data[attribute]);
            }
        });

        return model;
    }
}
