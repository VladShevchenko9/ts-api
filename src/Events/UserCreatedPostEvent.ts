import { Container } from '../Container'
import { MailSender } from '../Mail/MailSender'
import { PostRepository } from '../Repositories/PostRepository'
import { AbstractEvent } from './AbstractEvent'

export class UserCreatedPostEvent extends AbstractEvent {
    public getEventName(): string {
        return 'user-created-post';
    }

    protected register(): void {
        this.on(this.getEventName(), async (userId: number) => {
            const postRepository = Container.createInstance<PostRepository>(PostRepository.name);
            const totalPosts = await postRepository.countBy('user_id', userId);

            if (totalPosts == 1) {
                MailSender.send(userId, 'Congratulation with creating your first post!');
            }
        });
    }
}
