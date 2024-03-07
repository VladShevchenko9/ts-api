import { Response, Request, NextFunction } from 'express'
import asyncHandler from 'express-async-handler'
import { SessionFunctions } from '../Services/SessionFunctions'
import { RoleChecker } from '../Services/RoleChecker'

export class UserMiddleware {
    public static checkUserPermission = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const sessionUser = SessionFunctions.getUser(req);

        if (sessionUser.getAttrValue('id') !== parseInt(req.params.id) && RoleChecker.isUser(sessionUser)) {
            res.status(403).send('forbidden');

            return;
        }

        next();
    });
}
