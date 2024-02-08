import { User } from '../Models/User'
import { AbstractTransformer } from './AbstractTransformer'

export class UserTransformer extends AbstractTransformer {
    public transform(modelData: User | User[]): Record<string, any> | Record<string, any>[] {
        return super.transform(modelData);
    }
}
