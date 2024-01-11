// import express from 'express'
// import { UserService } from './src/Services/UserService'
// import { DB } from './src/Services/DB'
// import { QueryBuilder } from './src/Services/QueryBuilder'
// import { UserRepository } from './src/Repositories/UserRepository'
// import { PostRepository } from './src/Repositories/PostRepository'
// import { PostService } from './src/Services/PostService'
// import { Container } from './src/Container'
// import { UsersController } from './src/Controllers/UsersController'

// const app = express();
// const port = 3000;
// const db = Container.createInstance<DB>(DB.name);
// const qb = Container.createInstance<QueryBuilder>(QueryBuilder.name);
// const userRepository = Container.createInstance<UserRepository>(UserRepository.name, db, qb);
// const postRepository = Container.createInstance<PostRepository>(PostRepository.name, db, qb);
// const userService = Container.createInstance<UserService>(UserService.name, userRepository);
// const postService = Container.createInstance<PostService>(PostService.name, postRepository);
// const usersController = Container.createInstance<UsersController>(UsersController.name, userService);

// app.use(express.json());

// app.get('/', (req, res) => {
//     res.send(`
//         <a href="/users">Users</a>
//         <br>
//         <a href="/posts">Posts</a>
//     `);

// });

// app.get('/users', async (req, res) => { usersController.index(req, res); });

// app.get('/users/:id', async (req, res) => {
//     const userId = parseInt(req.params.id);
//     let user;

//     try {
//         user = await userService.show(userId);
//     } catch (e) {
//         res.status(404).send(e.message);
//         return;
//     }

//     res.send(user.toJson());
// });

// app.put('/users/:id', async (req, res) => {
//     const userId = parseInt(req.params.id);
//     let user;

//     try {
//         user = await userService.update(userId, {
//             first_name: String(req.body.first_name),
//             last_name: String(req.body.last_name),
//             email: String(req.body.email),
//             phone_number: String(req.body.phone_number)
//         })
//     } catch (e) {
//         res.status(400).send(e.message);
//         return;
//     }

//     res.send(user.toJson());
// });

// app.delete('/users/:id', async (req, res) => {
//     const userId = parseInt(req.params.id);

//     try {
//         await userService.delete(userId)
//     } catch (e) {
//         res.status(400).send(e.message);
//         return;
//     }

//     res.send({ success: true });
// });

// app.get('/posts', async (req, res) => {
//     const posts = (await postService.index()).map(post => post.toJson());
//     res.send(posts);
// });

// app.get('/posts/:id', async (req, res) => {
//     const postId = parseInt(req.params.id);
//     let post;

//     try {
//         post = await postService.show(postId);
//     } catch (e) {
//         res.status(404).send(e.message);
//         return;
//     }

//     res.send(post.toJson());
// });

// app.listen(port, () => {
//     console.log(`Timezones by location application is running on port ${port}.`);
// });

import express from 'express'
import { App } from './src/App'
import { UserService } from './src/Services/UserService'
import { DB } from './src/Services/DB'
import { QueryBuilder } from './src/Services/QueryBuilder'
import { UserRepository } from './src/Repositories/UserRepository'
import { Container } from './src/Container'
import { UsersController } from './src/Controllers/UsersController'
import { HomeController } from './src/Controllers/HomeController'

const db = Container.createInstance<DB>(DB.name);
const qb = Container.createInstance<QueryBuilder>(QueryBuilder.name);
const userRepository = Container.createInstance<UserRepository>(UserRepository.name, db, qb);
const userService = Container.createInstance<UserService>(UserService.name, userRepository);
const router = express.Router();

const app = new App(
    [
        Container.createInstance<UsersController>(UsersController.name, userService, router),
        Container.createInstance<HomeController>(HomeController.name, router),
    ],
);

app.listen();
