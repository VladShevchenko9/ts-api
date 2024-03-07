import { Response, Request, NextFunction } from 'express'
import asyncHandler from 'express-async-handler'
import { SessionFunctions } from '../Services/SessionFunctions'
import { RoleChecker } from '../Services/RoleChecker'
import { Container } from '../Container'
import { PostRepository } from '../Repositories/PostRepository'
import { Post } from '../Models/Post'

export class UserMiddleware {
    public static checkUserPermission = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.checkPermission(req, res, next, parseInt(req.params.id));
    });

    public static checkUserPostCreatePermission = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.checkPermission(req, res, next, parseInt(req.body.user_id));
    });

    public static checkUserPostUpdateOrDeletePermission = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const postId = parseInt(req.params.id);
        const postRepository = Container.createInstance<PostRepository>(PostRepository.name);
        let post: Post;

        try {
            post = await postRepository.find(postId) as Post;
        } catch (error) {
            res.status(404).send('post Not Found');

            return;
        }

        this.checkPermission(req, res, next, post.getAttrValue('user_id'));
    });

    private static checkPermission(req: Request, res: Response, next: NextFunction, userId: number): void {
        const sessionUser = SessionFunctions.getUser(req);

        if (sessionUser.getAttrValue('id') !== userId && RoleChecker.isUser(sessionUser)) {
            res.status(403).send('forbidden');

            return;
        }

        next();
    }
}
