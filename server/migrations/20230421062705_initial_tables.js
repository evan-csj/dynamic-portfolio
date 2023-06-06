/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('user', table => {
            table.string('id').primary().unique().notNullable();
            table.string('user_email').unique().notNullable();
            table.string('first_name').notNullable();
            table.string('last_name').notNullable();
            table.float('cash_usd', 20, 7).unsigned().defaultTo(0);
            table.float('cash_cad', 20, 7).unsigned().defaultTo(0);
            table.jsonb('dp');
            table.timestamps(true, true);
        })
        .createTable('symbol', table => {
            table.string('symbol').primary().unique().notNullable();
            table.string('name').notNullable();
            table.string('sector').notNullable();
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
            table.string('id').primary().unique().notNullable();
            table
                .string('user_id')
                .references('id')
                .inTable('user')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');
            table.string('ticker').notNullable();
            table.float('avg_price', 20, 7).notNullable();
            table.float('price', 12, 2).notNullable();
            table.float('buy_shares', 15, 5).notNullable();
            table.float('sell_shares', 15, 5).notNullable();
            table.string('currency').notNullable();
            table.timestamps(true, true);
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
            table.string('id').primary().unique().notNullable();
            table
                .string('user_id')
                .references('id')
                .inTable('user')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');
            table.string('ticker').notNullable();
            table.float('price', 12, 2).notNullable();
            table.float('prev_close', 12, 2).notNullable();
            table.string('currency').notNullable();
        })
        .createTable('portfolio', table => {
            table.string('id').primary().unique().notNullable();
            table
                .string('user_id')
                .references('id')
                .inTable('user')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');
            table.string('ticker').notNullable();
            table.integer('percentage').notNullable();
        })
        .createTable('forex', table => {
            table.string('symbol').primary().unique().notNullable();
            table.float('last_price', 12, 4).notNullable();
            table.timestamps(true, true);
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
        .dropTable('portfolio')
        .dropTable('user');
};
