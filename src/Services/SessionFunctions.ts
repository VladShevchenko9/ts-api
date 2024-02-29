import { SessionData } from 'express-session'
import { Request } from 'express'
import { User } from '../Models/User'

interface CustomSession extends SessionData {
    user?: User;
}

export class SessionFunctions {
    public static setUser(req: Request, user: User): void {
        (req.session as CustomSession).user = user;
    }

    public static getUser(req: Request): User {
        return (req.session as CustomSession).user;
    }
}
