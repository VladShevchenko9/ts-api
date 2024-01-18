import { AbstractModel } from './AbstractModel'

export class User extends AbstractModel {
    protected attributes = {
        id: 0,
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
    };
    protected static _table: string = 'user';
    protected static _requiredFields: string[] = ['first_name', 'last_name', 'email', 'phone_number'];
}
