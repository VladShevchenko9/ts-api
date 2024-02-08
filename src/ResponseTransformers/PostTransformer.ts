import { Post } from '../Models/Post'
import { AbstractTransformer } from './AbstractTransformer'

export class PostTransformer extends AbstractTransformer {
    public transform(modelData: Post | Post[]): Record<string, any> | Record<string, any>[] {
        return super.transform(modelData);
    }
}
