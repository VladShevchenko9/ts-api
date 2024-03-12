import { User } from '../Models/User'

export class CurrentUserData {
    private static _user: User | null = null;

    static set user(user: User) {
        this._user = user;
    }

    static get user(): User | null {
        return this._user;
    }
}
