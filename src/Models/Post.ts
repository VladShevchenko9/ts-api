import { AbstractModel } from './AbstractModel'

export class Post extends AbstractModel {
    protected attributes = {
        id: 0,
        title: '',
        content: '',
    };
    protected static _table: string = 'post';
    protected static _requiredFields: Record<string, string> = {
        title: 'Title',
        content: 'Content',
    };
}
