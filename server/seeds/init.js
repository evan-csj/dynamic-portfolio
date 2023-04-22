/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const userData = require('../seed_data/user');
const tradeData = require('../seed_data/trade');
const holdingData = require('../seed_data/holding');
const fundData = require('../seed_data/fund');

exports.seed = async function (knex) {
    await knex('user').del();
    await knex('trade').del();
    await knex('holding').del();
    await knex('fund').del();
    await knex('user').insert(userData);
    await knex('trade').insert(tradeData);
    await knex('holding').insert(holdingData);
    await knex('fund').insert(fundData);
};
