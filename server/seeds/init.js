/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const userData = require('../seed_data/user');
const symbolData = require('../seed_data/symbol');
const tradeData = require('../seed_data/trade');
const holdingData = require('../seed_data/holding');
const fundData = require('../seed_data/fund');
const watchlistData = require('../seed_data/watchlist')
const { v1 } = require('uuid');

exports.seed = async function (knex) {
    tradeData.map(item => {
        item['id'] = v1();
    });
    fundData.map(item => {
        item['id'] = v1();
    });
    holdingData.map(item => {
        item['id'] = item.user_id + '-' + item.ticker;
    });
    watchlistData.map(item => {
        item['id'] = item.user_id + '-' + item.ticker;
    })
    
    await knex('user').del();
    await knex('symbol').del();
    await knex('trade').del();
    await knex('holding').del();
    await knex('fund').del();
    await knex('watchlist').del();
    await knex('user').insert(userData);
    await knex('symbol').insert(symbolData);
    await knex('trade').insert(tradeData);
    await knex('holding').insert(holdingData);
    await knex('fund').insert(fundData);
    await knex('watchlist').insert(watchlistData);
};
