import { AbstractModel } from './AbstractModel'

export class Post extends AbstractModel {
    protected attributes = {
        id: 0,
        title: '',
        content: '',
        user_id: 0,
    };
    protected static _table: string = 'post';
}
