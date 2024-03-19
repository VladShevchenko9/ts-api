import express from 'express'
import { App } from './src/App'
import { UserService } from './src/Services/UserService'
import { PostService } from './src/Services/PostService'
import { UserRepository } from './src/Repositories/UserRepository'
import { PostRepository } from './src/Repositories/PostRepository'
import { Container } from './src/Container'
import { UsersController } from './src/Controllers/UsersController'
import { PostsController } from './src/Controllers/PostsController'
import { KnexQueryBuilder } from './src/Services/KnexQueryBuilder'

const knexQb = Container.createInstance<KnexQueryBuilder>(KnexQueryBuilder.name);
const userRepository = Container.createInstance<UserRepository>(UserRepository.name, knexQb);
const postRepository = Container.createInstance<PostRepository>(PostRepository.name, knexQb);
const userService = Container.createInstance<UserService>(UserService.name, userRepository);
const postService = Container.createInstance<PostService>(PostService.name, postRepository);
const router = express.Router();

const app = new App(
    [
        Container.createInstance<UsersController>(UsersController.name, userService, router),
        Container.createInstance<PostsController>(PostsController.name, postService, router),
    ],
);

app.listen();
