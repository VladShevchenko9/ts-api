import { AbstractModel } from './AbstractModel'

export class User extends AbstractModel {
    protected attributes = {
        id: 0,
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        password: '',
        role_id: 1,
    };
    protected static _table: string = 'user';

    public toJson(): Record<string, any> {
        let data = super.toJson();
        delete data.password

        return data;
    }
}
