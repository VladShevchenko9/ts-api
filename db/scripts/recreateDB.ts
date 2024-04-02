import { Container } from '../../src/Container'
import { KnexQueryBuilder } from '../../src/Services/KnexQueryBuilder'
import * as fs from 'fs'
import populateUsersTable from './populateUsersTable'
import populatePostsTable from './populatePostsTable'

const knexQb = Container.createInstance<KnexQueryBuilder>(KnexQueryBuilder.name);

(async () => {
    await knexQb.qb.schema.dropTableIfExists('post');
    await knexQb.qb.schema.dropTableIfExists('user');
    await knexQb.qb.schema.dropTableIfExists('role');

    const sql = fs.readFileSync(__dirname + '/../users_api_db.sql', 'utf8');
    const sqlStatements = sql.split(';').filter(statement => statement.trim() !== '');

    for (const statement of sqlStatements) {
        await knexQb.qb.raw(statement);
    }

    await populateUsersTable();
    await populatePostsTable();

    process.exit();
})();
