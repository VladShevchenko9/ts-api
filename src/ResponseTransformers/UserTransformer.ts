import { User } from '../Models/User'
import { AbstractTransformer } from './AbstractTransformer'

export class UserTransformer extends AbstractTransformer {
    protected transformSingleRecord(modelData: User): Record<string, any> {
        let transformData = super.transformSingleRecord(modelData);
        transformData['isGmailUser'] = transformData['email'].endsWith('@gmail.com');

        return transformData;
    }
}
