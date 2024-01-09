import { UserService } from '../src/Services/UserService'
import { DB } from '../src/Services/DB'
import { QueryBuilder } from '../src/Services/QueryBuilder'
import { PostService } from '../src/Services/PostService'
import { UserRepository } from '../src/Repositories/UserRepository'
import { PostRepository } from '../src/Repositories/PostRepository'
import { User } from '../src/Models/User'
import { Post } from '../src/Models/Post'


function getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
}

const db = new DB();
const qb = new QueryBuilder();
const userRepository = new UserRepository(db, qb);
const postRepository = new PostRepository(db, qb);

const userService = new UserService(userRepository);
const postService = new PostService(postRepository);

async function testUserStore(): Promise<User> {
    const user = await userService.store({
        first_name: 'Stas',
        last_name: 'Melnik',
        email: getRandomInt(9999) + 'Kr33a@gmail.sru',
        phone_number: '38012543' + getRandomInt(9999)
    });

    if (user instanceof User) {
        console.log('User store test - PASSED');
        return user;
    }

    throw new Error('User store test - FAILED');
}

async function testUserStoreIfIncompleteData(): Promise<void> {
    try {
        await userService.store({
            last_name: 'Kotick',
            email: getRandomInt(9999) + 'Kr33a@gmail.sru',
            phone_number: '38012543' + getRandomInt(9999)
        });
    } catch (e) {
        if (e.message === 'First name is required') {
            console.log('User store if incomplete data test - PASSED');
            return;
        }
    }

    throw new Error('User store if incomplete data test - FAILED');
}

async function testUserStoreIfDuplicatedEmail(): Promise<void> {
    try {
        await userService.store({
            first_name: 'Kostya',
            last_name: 'Krisa2',
            email: 'jac@fat.ua',
            phone_number: '38012543' + getRandomInt(9999)
        });
    } catch (e) {
        if (e.message === 'User with this Email already exists') {
            console.log('User store if duplicated email test - PASSED');
            return;
        }
    }

    throw new Error('User store if duplicated email test - FAILED');
}

async function testUserStoreIfDuplicatedPhone(): Promise<void> {
    try {
        await userService.store({
            first_name: 'Kostya',
            last_name: 'Krisa2',
            email: 'ja123c@fat.ua',
            phone_number: '+38 (096)-572-03-12'
        });
    } catch (e) {
        if (e.message === 'User with this Phone number already exists') {
            console.log('User store if duplicated phone test - PASSED');
            return;
        }
    }

    throw new Error('User store if duplicated phone test - FAILED');
}


async function testUserUpdate(user: User): Promise<User> {
    const updatedUser = await userService.update(user.getAttrValue('id'), {
        first_name: 'Yura',
        last_name: 'Clown',
        email: getRandomInt(9999) + 'Kr33a@gmail.sru',
        phone_number: '38012543' + getRandomInt(9999)
    });

    if (updatedUser instanceof User) {
        console.log('User update test - PASSED');
        return updatedUser;
    }

    throw new Error('User update test - FAILED');
}

async function testUserIndex(): Promise<void> {
    const users = await userService.index();

    if (users.length > 0 && users[0] instanceof User) {
        console.log('User index test - PASSED');
        return;
    }

    throw new Error('User index test - FAILED');
}

async function testUserShow(): Promise<void> {
    const user = await userService.show(3);

    if (user instanceof User && user.getAttrValue('id') === 3) {
        console.log('User show test - PASSED');
        return;
    }

    throw new Error('User show test - FAILED');
}

async function testUserDelete(userId: number): Promise<void> {
    const isDeleted = await userService.delete(userId);

    if (isDeleted) {
        console.log('User delete test - PASSED');
        return;
    }

    throw new Error('User delete test - FAILED');
}

async function testUserShowIfDoesNotExist(userId: number): Promise<void> {
    let userExists = true;

    try {
        await userService.show(userId);
    } catch (e) {
        if (e.message === 'User does not exist') {
            userExists = false;
        }
    }

    if (!userExists) {
        console.log('User show if does not exist test - PASSED');
        return;
    }

    throw new Error('User show if does not exist test - FAILED');
}

async function testUserUpdateIfDoesNotExist(): Promise<void> {
    try {
        await userService.update(-1, {
            first_name: 'Kostya',
            last_name: 'Krisa2',
            email: 'ja14444c@fat.ua',
            phone_number: '+38 (123)-572-03-12'
        });
    } catch (e) {
        if (e.message === 'User does not exist') {
            console.log('User update if does not exist test - PASSED');
            return;
        }
    }

    throw new Error('User update if does not exist test - FAILED');
}

async function testUserUpdateWithSameEmail(): Promise<void> {
    try {
        await userService.update(12, {
            first_name: 'Kostya',
            last_name: 'Krisa2',
            email: 'jac@fat.ua',
            phone_number: '38012543' + getRandomInt(9999)
        });
    } catch (e) {
        if (e.message === 'User with this Email already exists') {
            console.log('User update with same email test - PASSED');
            return;
        }
    }

    throw new Error('User update with same email test - FAILED');
}

async function testUserUpdateWithIncompleteData(): Promise<void> {
    try {
        await userService.update(12, {
            first_name: '',
            last_name: 'Krisa2',
            email: '123@gmail.sru',
            phone_number: '38012543' + getRandomInt(9999)
        });
    } catch (e) {
        if (e.message === 'First name is required') {
            console.log('User update with incomplete data test - PASSED');
            return;
        }
    }

    throw new Error('User update with incomplete data test - FAILED');
}

async function testUserUpdateWithSamePhone(): Promise<void> {
    try {
        await userService.update(12, {
            first_name: '123132',
            last_name: 'Krisa2',
            email: '123@gmail.sru',
            phone_number: '380125432773'
        });
    } catch (e) {
        if (e.message === 'User with this Phone number already exists') {
            console.log('User update with same Phone test - PASSED');
            return;
        }
    }

    throw new Error('User update with same phone test - FAILED');
}

async function testUserDeleteWithNonExistId(): Promise<void> {
    try {
        await userService.delete(-1);
    } catch (e) {
        if (e.message === 'User does not exist') {
            console.log('User delete with non exist id - PASSED');
            return;
        }
    }

    throw new Error('User delete with non exist id - FAILED')
}

async function testPostStore(): Promise<Post> {
    const post = await postService.store({
        title: 'Title',
        content: 'Content',
    });

    if (post instanceof Post) {
        console.log('Post store test - PASSED');
        return post;
    }

    throw new Error('Post store test - FAILED');
}

async function testPostUpdate(post: Post): Promise<Post> {
    const updatedPost = await postService.update(post.getAttrValue('id'), {
        title: 'Yura',
        content: 'Clown',
    });

    if (updatedPost instanceof Post) {
        console.log('Post update test - PASSED');
        return updatedPost;
    }

    throw new Error('Post update test - FAILED');
}

async function testPostIndex(): Promise<void> {
    const posts = await postService.index();

    if (posts.length > 0 && posts[0] instanceof Post) {
        console.log('Post index test - PASSED');
        return;
    }

    throw new Error('Post index test - FAILED');
}

async function testPostShow(): Promise<void> {
    const post = await postService.show(2);

    if (post instanceof Post && post.getAttrValue('id') === 2) {
        console.log('Post show test - PASSED');
        return;
    }

    throw new Error('Post show test - FAILED');
}

async function testPostDelete(postId: number): Promise<void> {
    const isDeleted = await postService.delete(postId);

    if (isDeleted) {
        console.log('Post delete test - PASSED');
        return;
    }

    throw new Error('Post delete test - FAILED');
}

async function testPostShowIfDoesNotExist(postId: number): Promise<void> {
    let postExists = true;

    try {
        await postService.show(postId);
    } catch (e) {
        if (e.message === 'Post does not exist') {
            postExists = false;
        }
    }

    if (!postExists) {
        console.log('Post show if does not exist test - PASSED');
        return;
    }

    throw new Error('Post show if does not exist test - FAILED');
}

async function testPostStoreIfIncompleteData(): Promise<void> {
    try {
        await postService.store({
            content: 'Content',
        });
    } catch (e) {
        if (e.message === 'Title is required') {
            console.log('Post store with incomplete data test - PASSED');
            return;
        }
    }

    throw new Error('Post store with incomplete data test - FAILED');
}

async function testPostUpdateIfDoesNotExist(): Promise<void> {
    try {
        await postService.update(-1, {
            title: 'Kostya',
            content: 'Krisa2',
        });
    } catch (e) {
        if (e.message === 'Post does not exist') {
            console.log('Post update if does not exist test - PASSED');
            return;
        }
    }

    throw new Error('Post update if does not exist test - FAILED');
}

async function testPostUpdateWithIncompleteData(postId: number): Promise<void> {
    try {
        await postService.update(postId, {
            title: '',
            content: 'Krisa2',
        });
    } catch (e) {
        if (e.message === 'Title is required') {
            console.log('Post update with incomplete data test - PASSED');
            return;
        }
    }

    throw new Error('Post update with incomplete data test - FAILED')
}

async function testPostDeleteWithNonExistId(): Promise<void> {
    try {
        await postService.delete(-1);
    } catch (e) {
        if (e.message === 'Post does not exist') {
            console.log('Post delete with non exist id - PASSED');
            return;
        }
    }

    throw new Error('Post delete with non exist id - FAILED');
}

(async function () {
    const checkUserService = async () => {
        const user = await testUserStore();
        await testUserStoreIfIncompleteData();
        await testUserStoreIfDuplicatedEmail();
        await testUserStoreIfDuplicatedPhone();
        const updatedUser = await testUserUpdate(user);
        await testUserUpdateIfDoesNotExist();
        await testUserUpdateWithSameEmail();
        await testUserUpdateWithSamePhone();
        await testUserUpdateWithIncompleteData();
        await testUserDeleteWithNonExistId();
        await testUserIndex();
        await testUserShow();
        await testUserDelete(updatedUser.getAttrValue('id'));
        await testUserShowIfDoesNotExist(updatedUser.getAttrValue('id'));
    };

    const checkPostService = async () => {
        const post = await testPostStore();
        const updatedPost = await testPostUpdate(post);
        await testPostIndex();
        await testPostShow();
        await testPostStoreIfIncompleteData();
        await testPostUpdateIfDoesNotExist();
        await testPostUpdateWithIncompleteData(updatedPost.getAttrValue('id'));
        await testPostDelete(updatedPost.getAttrValue('id'));
        await testPostShowIfDoesNotExist(updatedPost.getAttrValue('id'));
        await testPostDeleteWithNonExistId();
    };

    await checkUserService();
    await checkPostService();

    process.exit();
})();
