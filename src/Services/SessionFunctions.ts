import { SessionData } from 'express-session'
import { Request } from 'express'
import { User } from '../Models/User'

interface CustomSession extends SessionData {
    user?: Record<string, any>;
}

export class SessionFunctions {
    public static setUser(req: Request, user: User): void {
        (req.session as CustomSession).user = user.toJson();
    }

    public static getUser(req: Request): User | null {
        const userData = (req.session as CustomSession).user || null;

        return new User().populateFromObject(userData) as User;
    }
}
