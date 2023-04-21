/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('user', table => {
            table.uuid('id').primary();
            table.string('user_name').unique().notNullable();
            table.string('user_email').unique().notNullable();
            table.string('first_name').notNullable();
            table.string('last_name').notNullable();
            table.date('dob').notNullable();
            table.integer('sin', 9).unique().notNullable();
            table.float('total_asset_USD').unsigned().defaultTo(0);
            table.float('total_cash_USD').unsigned().defaultTo(0);
            table.float('total_equity_USD').unsigned().defaultTo(0);
            table.float('total_asset_CAD').unsigned().defaultTo(0);
            table.float('total_cash_CAD').unsigned().defaultTo(0);
            table.float('total_equity_CAD').unsigned().defaultTo(0);
            table.timestamps(true, true);
        })
        .createTable('trade', table => {
            table.uuid('id').primary();
            table
                .string('user_id')
                .notNullable()
                .references('id')
                .inTable('user')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');
            table.string('ticker').notNullable();
            table.float('price').notNullable();
            table.float('share').notNullable();
            table.boolean('buy').notNullable();
            table.timestamps(true, false);
        })
        .createTable('holding', table => {
            table.uuid('id').primary();
            table
                .string('user_id')
                .notNullable()
                .references('id')
                .inTable('user')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');
            table.string('ticker').notNullable();
            table.float('total_value').notNullable();
            table.float('share').notNullable();
            table.timestamps(true, true);
        })
        .createTable('fund', table => {
            table.uuid('id').primary();
            table
                .string('user_id')
                .notNullable()
                .references('id')
                .inTable('user')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');
            table.float('amount').notNullable();
            table.boolean('deposit').notNullable();
            table.timestamps(true, false);
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('fund').dropTable('holding').dropTable('trade').dropTable('user');
};
