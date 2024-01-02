require('dotenv').config();
const {
    DB_LOCAL_DBNAME,
    DB_LOCAL_USER,
    DB_LOCAL_PASSWORD,
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_DBNAME,
    DB_PG_HOST,
    DB_PG_PORT,
    DB_PG_NAME,
    DB_PG_USER,
    DB_PG_PASSWORD,
    DB_PG_URL,
} = process.env;

// module.exports = {
//     client: 'mysql2',
//     connection: {
//         host: DB_HOST,
//         user: DB_USER,
//         port: '3306',
//         password: DB_PASSWORD,
//         database: DB_DBNAME,
//         charset: 'utf8',
//     },
//     migrations: {
//         directory: './migrations',
//     },
//     seeds: {
//         directory: './seeds',
//     },
// };

// module.exports = {
//     client: 'mysql2',
//     connection: {
//         host: '127.0.0.1',
//         user: DB_LOCAL_USER,
//         password: DB_LOCAL_PASSWORD,
//         database: DB_LOCAL_DBNAME,
//         charset: 'utf8',
//     },
//     migrations: {
//         directory: './migrations',
//     },
//     seeds: {
//         directory: './seeds',
//     },
// };

// module.exports = {
//     client: 'pg',
//     connection: {
//         host: 'localhost',
//         user: 'postgres',
//         port: '5432',
//         password: DB_LOCAL_PASSWORD,
//         database: DB_LOCAL_DBNAME,
//         charset: 'utf8',
//     },
//     migrations: {
//         directory: './migrations',
//     },
//     seeds: {
//         directory: './seeds',
//     },
// };

module.exports = {
    client: 'pg',
    connection: {
        connectionString: DB_PG_URL,
        host: DB_PG_HOST,
        user: DB_PG_USER,
        port: DB_PG_PORT,
        password: DB_PG_PASSWORD,
        database: DB_PG_NAME,
        ssl: true,
        charset: 'utf8',
    },
    migrations: {
        directory: './migrations',
    },
    seeds: {
        directory: './seeds',
    },
};
