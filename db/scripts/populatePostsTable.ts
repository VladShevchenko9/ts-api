import { faker } from '@faker-js/faker'
import { Container } from '../../src/Container'
import { KnexQueryBuilder } from '../../src/Services/KnexQueryBuilder'
import { PostRepository } from '../../src/Repositories/PostRepository'
import { UserRepository } from '../../src/Repositories/UserRepository'
import getRandomInt from './random'
import getTotalNumber from './totalNumber'

const knexQb = Container.createInstance<KnexQueryBuilder>(KnexQueryBuilder.name);
const postRepository = Container.createInstance<PostRepository>(PostRepository.name, knexQb);
const userRepository = Container.createInstance<UserRepository>(UserRepository.name, knexQb);

function getRundomUserId(arrayOfIds: Record<'id', number>[]): number {
    const randomElement = arrayOfIds[getRandomInt(0, arrayOfIds.length - 1)]

    return randomElement.id;
}

function createPost(arrayOfIds: Record<'id', number>[]): Record<'title' | 'content' | 'user_id', string | number> {
    return {
        title: faker.string.alpha(),
        content: faker.string.alpha(),
        user_id: getRundomUserId(arrayOfIds)
    };
}

const postsTotal = getTotalNumber();

(async () => {
    let userIds = await knexQb.qb.select('id').from(userRepository.table);

    for (let i = 0; i < postsTotal; i++) {
        const post = createPost(userIds);
        await postRepository.create(post);
    }

    process.exit();
})();
