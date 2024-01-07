import {QueryBuilder} from "../src/Services/QueryBuilder";
import {Container} from "../src/Container";
import {DB} from "../src/Services/DB";

const qb = new QueryBuilder();
const db = new DB();

// const sql = qb.select('*')
//     .from('user')
//     .where('email', '!=', '')
//     .orWhere('id', '>', 5)
//     .andWhere('phone_number', '!=', '')
//     .orderBy('first_name', 'ASC')
//     .limit(3)
//      .sql;
const sqlInsert = qb.insert('post')
    .set({
        title: 'V"lad',
        content: "Gle'c'k'",
    }).sql;


console.log(sqlInsert, QueryBuilder.name);

//console.log(Container.getObjectByClass('DB'));

async function firstNameToLowercase() {
    const sql = qb.update('user')
        .set({first_name: 'CONCAT(LOWER(SUBSTRING(first_name, 1, 1)), SUBSTRING(first_name, 2))'}, false)
        .sql;

    await db.executeQuery(sql);
}

(async function () {
    await firstNameToLowercase();
})();

async function swap() {
    
    const sql = qb.select().from('post').sql;
    const posts = await db.executeQuery(sql);

    for (const post of posts) {

        const swapSql = qb.update('post').set({title: post.content, content: post.title}).where('id', '=', post.id).sql;

        console.log(swapSql);
        console.log(post);

        await db.executeQuery(swapSql);
    }

}

(async function () {
    await swap();
})();


// async function swapTitleAndContent() {
//
//     const sql = qb.update('`post` p1, `post` p2')
//         .set({'p1.title': 'p1.content', 'p1.content': 'p2.title'}, false)
//         .where('p1.id', '=', 'p2.id', false)
//         .sql;
//     console.log(sql);
//
//      await db.executeQuery(sql);
// }
//
// (async function () {
//     await swapTitleAndContent();
// })();

// console.log(sql);
// console.log(qb.sql);
