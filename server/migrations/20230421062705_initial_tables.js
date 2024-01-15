/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('user', table => {
            table.string('id').primary().unique().notNullable();
            table.string('github_username').unique();
            table.string('password').defaultTo('');
            table.string('user_gmail').unique();
            table.string('first_name').defaultTo('');
            table.string('last_name').defaultTo('');
            table.float('cash_usd', 20, 7).unsigned().defaultTo(0);
            table.float('cash_cad', 20, 7).unsigned().defaultTo(0);
            table.jsonb('dp').defaultTo({});
            table.boolean('is_new').defaultTo(true);
            table.timestamps(true, true);
        })
        .createTable('symbol', table => {
            table.string('symbol').primary().unique().notNullable();
            table.string('name');
            table.string('exchange');
            table.string('sector');
            table.string('logo');
            table.float('price', 12, 2).defaultTo(0);
            table.float('prev_close', 12, 2).defaultTo(0);
            table.string('currency');
            table.timestamps(true, true);
        })
        .createTable('trade', table => {
            table.uuid('id').primary().unique().notNullable();
            table
                .string('user_id')
                .references('id')
                .inTable('user')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');
            table.string('ticker').notNullable();
            table.float('price', 10, 3).notNullable();
            table.float('shares', 15, 5).notNullable();
            table.string('type').notNullable();
            table.string('order_status').notNullable();
            table.string('currency').notNullable();
            table.timestamps(true, true);
        })
        .createTable('holding', table => {
            table.uuid('id').primary().unique().notNullable();
            table
                .string('user_id')
                .references('id')
                .inTable('user')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');
            table.string('ticker').notNullable();
            table.float('avg_price', 20, 7).notNullable();
            table.float('buy_shares', 15, 5).notNullable();
            table.float('sell_shares', 15, 5).notNullable();
        })
        .createTable('fund', table => {
            table.uuid('id').primary().unique().notNullable();
            table
                .string('user_id')
                .references('id')
                .inTable('user')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');
            table.float('amount', 20, 7).notNullable();
            table.string('type').notNullable();
            table.string('currency').notNullable();
            table.timestamps(true, true);
        })
        .createTable('watchlist', table => {
            table.uuid('id').primary().unique().notNullable();
            table
                .string('user_id')
                .references('id')
                .inTable('user')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');
            table.string('ticker').notNullable();
        })
        .createTable('forex', table => {
            table.string('symbol').primary().unique().notNullable();
            table.float('last_price', 12, 4).notNullable();
            table.timestamps(true, true);
        })
        .createTable('oauth', table => {
            table.string('sid').primary().unique().notNullable();
            table.timestamp('expire').notNullable();
            table.jsonb('sess').notNullable();
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .dropTable('forex')
        .dropTable('watchlist')
        .dropTable('fund')
        .dropTable('holding')
        .dropTable('trade')
        .dropTable('symbol')
        .dropTable('user')
        .dropTable('oauth');
};
