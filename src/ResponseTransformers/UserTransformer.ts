import { User } from '../Models/User'
import { AbstractTransformer } from './AbstractTransformer'

export class UserTransformer extends AbstractTransformer {
    protected async transformSingleRecord(modelData: User): Promise<Record<string, any>> {
        let transformData = await super.transformSingleRecord(modelData);
        transformData['isGmailUser'] = transformData['email'].endsWith('@gmail.com');

        return transformData;
    }
}
