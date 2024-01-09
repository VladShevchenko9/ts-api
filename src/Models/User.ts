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
    protected static _requiredFields: Record<string, string> = {
        first_name: 'First name',
        last_name: 'Last name',
        email: 'Email',
        phone_number: 'Phone number'
    };
}
