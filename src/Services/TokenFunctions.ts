import { User } from '../Models/User'
import jsonwebtoken from 'jsonwebtoken'
import 'dotenv/config'
import { Request } from 'express'
import { CurrentUserData } from '../Global/CurrentUserData'

export class TokenFunctions {
    public static generateToken(user: User): string {
        return jsonwebtoken.sign(user.toJson(), '' + process.env.TOKEN_SECRET, { expiresIn: '10h' });
    }

    public static authenticateToken(req: Request): void {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            throw new Error('token not found');
        }

        jsonwebtoken.verify(token, '' + process.env.TOKEN_SECRET, (err: Error, userData: Record<string, any>) => {
            if (err) {
                throw new Error('invalid token');
            }

            const user = new User().populateFromObject(userData) as User;

            CurrentUserData.user = user;
        });
    }
}
