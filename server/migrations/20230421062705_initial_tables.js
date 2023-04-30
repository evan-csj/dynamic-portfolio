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
            table.string('sin', 11).unique().notNullable();
            table.decimal('cash_usd', 20, 7).unsigned().defaultTo(0);
            table.decimal('cash_cad', 20, 7).unsigned().defaultTo(0);
            table.decimal('total_deposit', 20, 7).unsigned().defaultTo(0);
            table.decimal('total_withdraw', 20, 7).unsigned().defaultTo(0);
            table.timestamps(true, true);
        })
        .createTable('trade', table => {
            table.uuid('id').primary();
            table.uuid('user_id').references('id').inTable('user').onUpdate('CASCADE').onDelete('CASCADE');
            table.string('ticker').notNullable();
            table.decimal('price', 10, 3).notNullable();
            table.decimal('share', 15, 5).notNullable();
            table.boolean('buy').notNullable();
            table.string('order_status').notNullable();
            table.string('currency').notNullable();
            table.timestamps(true, false);
        })
        .createTable('holding', table => {
            table.uuid('id').primary();
            table.uuid('user_id').references('id').inTable('user').onUpdate('CASCADE').onDelete('CASCADE');
            table.string('ticker').notNullable();
            table.decimal('total_value', 20, 7).notNullable();
            table.decimal('share', 15, 5).notNullable();
            table.string('currency').notNullable();
            table.timestamps(true, true);
        })
        .createTable('fund', table => {
            table.uuid('id').primary();
            table.uuid('user_id').references('id').inTable('user').onUpdate('CASCADE').onDelete('CASCADE');
            table.decimal('amount').notNullable();
            table.string('type').notNullable();
            table.string('currency').notNullable();
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
