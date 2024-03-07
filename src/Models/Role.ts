import { AbstractModel } from './AbstractModel'

export class Role extends AbstractModel {
    protected attributes = {
        id: 0,
        name: '',
    };

    protected static _table: string = 'role';
}
