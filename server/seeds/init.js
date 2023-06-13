/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const axios = require('axios');
const userData = require('../seed_data/user');
// const symbolData = require('../seed_data/symbol');
const tradeData = require('../seed_data/trade');
const holdingData = require('../seed_data/holding');
const fundData = require('../seed_data/fund');
const watchlistData = require('../seed_data/watchlist');
const portfolioData = require('../seed_data/portfolio');
const forexData = require('../seed_data/forex');
const { v1 } = require('uuid');
const { FMP_KEY } = process.env;

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
    });
    portfolioData.map(item => {
        item['id'] = item.user_id + '-' + item.ticker;
    });

    const nasdaq100 = await axios.get(
        `https://financialmodelingprep.com/api/v3/nasdaq_constituent?apikey=${FMP_KEY}`
    );

    const sp500 = await axios.get(
        `https://pkgstore.datahub.io/core/s-and-p-500-companies/constituents_json/data/297344d8dc0a9d86b8d107449c851cc8/constituents_json.json`
    );

    await knex('user').del();
    await knex('symbol').del();
    await knex('trade').del();
    await knex('holding').del();
    await knex('fund').del();
    await knex('watchlist').del();
    await knex('portfolio').del();
    await knex('forex').del();

    Promise.allSettled([nasdaq100, sp500]).then(async response => {
        const IXIC = response[0].value.data;
        const SPX = response[1].value.data;
        const formattedIXIC = IXIC.map(item => {
            return {
                symbol: item.symbol,
            };
        });
        const formattedSPX = SPX.map(item => {
            return {
                symbol: item.Symbol,
            };
        });

        formattedIXIC.map(async item => {
            await knex('symbol').insert(item);
        });

        formattedSPX.map(async item => {
            const symbol = await knex('symbol').where({ symbol: item.symbol });
            if (symbol.length === 0) {
                await knex('symbol').insert(item);
            }
        });
    });

    await knex('user').insert(userData);
    await knex('trade').insert(tradeData);
    await knex('holding').insert(holdingData);
    await knex('fund').insert(fundData);
    await knex('watchlist').insert(watchlistData);
    await knex('portfolio').insert(portfolioData);
    await knex('forex').insert(forexData);
};
