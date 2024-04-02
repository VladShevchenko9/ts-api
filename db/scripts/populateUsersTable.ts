import { faker } from '@faker-js/faker'
import { Container } from '../../src/Container'
import { KnexQueryBuilder } from '../../src/Services/KnexQueryBuilder'
import { UserRepository } from '../../src/Repositories/UserRepository'
import bcrypt from 'bcrypt'
import getRandomInt from './random'
import getTotalNumber from './totalNumber'

function createUser(): Record<string, string | number> {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('Qwerty_12345', salt);

    return {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        phone_number: '+3809' + faker.string.numeric(8),
        role_id: getRandomInt(1, 2),
        password: hash,
    };
}

export default async function populateUsersTable() {
    const knexQb = Container.createInstance<KnexQueryBuilder>(KnexQueryBuilder.name);
    const userRepository = Container.createInstance<UserRepository>(UserRepository.name, knexQb);
    const usersTotal = getTotalNumber();

    for (let i = 0; i < usersTotal; i++) {
        const user = createUser();
        await userRepository.create(user);
    }
}
