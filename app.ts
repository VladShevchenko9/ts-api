import express from 'express'
import { App } from './src/App'
import { UserService } from './src/Services/UserService'
import { PostService } from './src/Services/PostService'
import { DB } from './src/Services/DB'
import { QueryBuilder } from './src/Services/QueryBuilder'
import { UserRepository } from './src/Repositories/UserRepository'
import { PostRepository } from './src/Repositories/PostRepository'
import { Container } from './src/Container'
import { UsersController } from './src/Controllers/UsersController'
import { PostsController } from './src/Controllers/PostsController'
import { UserRequest } from './src/Requests/UserRequest'
import { PostRequest } from './src/Requests/PostRequest'

const db = Container.createInstance<DB>(DB.name);
const qb = Container.createInstance<QueryBuilder>(QueryBuilder.name);
const userRepository = Container.createInstance<UserRepository>(UserRepository.name, db, qb);
const postRepository = Container.createInstance<PostRepository>(PostRepository.name, db, qb);
const userService = Container.createInstance<UserService>(UserService.name, userRepository);
const postService = Container.createInstance<PostService>(PostService.name, postRepository);
const userRequest = Container.createInstance<UserRequest>(UserRequest.name);
const postRequest = Container.createInstance<PostRequest>(PostRequest.name);
const router = express.Router();

const app = new App(
    [
        Container.createInstance<UsersController>(UsersController.name, userService, router, userRequest),
        Container.createInstance<PostsController>(PostsController.name, postService, router, postRequest),
    ],
);

app.listen();
