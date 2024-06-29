require('dotenv').config();
const {
    DB_PG_URL,
    PGHOST,
    PGDATABASE,
    PGUSER,
    PGPASSWORD,
    ENDPOINT_ID,
} = process.env;

module.exports = {
    client: 'pg',
    connection: {
        host: PGHOST,
        database: PGDATABASE,
        user: PGUSER,
        password: PGPASSWORD,
        port: 5432,
        ssl: { rejectUnauthorized: false },
        options: `project=${ENDPOINT_ID}`,
    },
};

// module.exports = {
//     client: 'pg',
//     connection: {
//         connectionString: DB_PG_URL,
//         port: 5432,
//         ssl: true,
//         charset: 'utf8',
//     },
//     migrations: {
//         directory: './migrations',
//     },
//     seeds: {
//         directory: './seeds',
//     },
// };