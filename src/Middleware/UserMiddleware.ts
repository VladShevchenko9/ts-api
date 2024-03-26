import { Response, Request, NextFunction } from 'express'
import asyncHandler from 'express-async-handler'
import { Container } from '../Container'
import { PostRepository } from '../Repositories/PostRepository'
import { Post } from '../Models/Post'
import { CurrentUserData } from '../Global/CurrentUserData'
import { RoleChecker } from '../Services/RoleChecker'

export class UserMiddleware {
    private static readonly forbiddenMessage: string = 'This operation is not allowed';

    public static checkUserPermission = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        await this.checkPermission(res, next, parseInt(req.params.id));
    });

    public static checkUserPostCreatePermission = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        await this.checkPermission(res, next, parseInt(req.body.user_id));
    });

    public static checkUserPostUpdateOrDeletePermission = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const postId = parseInt(req.params.id);
        const postRepository = Container.createInstance<PostRepository>(PostRepository.name);
        let post: Post;

        try {
            post = await postRepository.find(postId) as Post;
        } catch (error) {
            res.status(404).send(error.message);

            return;
        }

        await this.checkPermission(res, next, post.getAttrValue('user_id'));
    });

    private static async checkPermission(res: Response, next: NextFunction, userId: number): Promise<void> {
        const user = CurrentUserData.user;

        if (!user || user.getAttrValue('id') !== userId && await RoleChecker.isUser(user)) {
            res.status(403).send(this.forbiddenMessage);

            return;
        }

        next();
    }
}
