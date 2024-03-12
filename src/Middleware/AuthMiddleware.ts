import { Response, Request, NextFunction } from 'express'
import asyncHandler from 'express-async-handler'
import 'dotenv/config'
import { TokenFunctions } from '../Services/TokenFunctions'

export class AuthMiddleware {
    public static authenticate = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            TokenFunctions.authenticateToken(req);
        } catch (error) {
            res.status(401).send(error.message);

            return;
        }

        next();
    });
}
