import { Response, Request, NextFunction } from 'express'
import asyncHandler from 'express-async-handler'
import { SessionFunctions } from '../Services/SessionFunctions'

export class AuthMiddleware {
    public static checkSessionUser = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        if (!SessionFunctions.getUser(req)) {
            res.status(401).send('unauthorized user');

            return;
        }

        next();
    });
}
