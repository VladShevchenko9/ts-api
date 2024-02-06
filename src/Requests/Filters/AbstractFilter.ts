import { AbstractRequest } from '../AbstractRequest'

export abstract class AbstractFilter extends AbstractRequest {
    public toRecord(): Record<string, any> {
        const context = this;
        let filterData: Record<string, any> = {};

        Object.keys(context).map(property => {
            if (context[property]) {
                filterData[property] = context[property];
            }
        });

        return filterData;
    }
}
