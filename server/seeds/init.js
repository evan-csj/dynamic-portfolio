/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const axios = require('axios');
const userData = require('../seed_data/user');
const symbolData = require('../seed_data/symbol');
const tradeData = require('../seed_data/trade');
const holdingData = require('../seed_data/holding');
const fundData = require('../seed_data/fund');
const watchlistData = require('../seed_data/watchlist');
const { v1 } = require('uuid');
const { FINNHUB_KEY } = process.env;

const finnHub = mic => {
    return {
        method: 'GET',
        url: 'https://finnhub.io/api/v1/stock/symbol',
        params: {
            exchange: 'US',
            mic: mic,
        },
        headers: {
            'X-Finnhub-Token': FINNHUB_KEY,
        },
    };
};

exports.seed = async function (knex) {
    const mics = ['XNYS', 'XNAS', 'ARCX'];

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

    const promises = mics.map(item => axios.request(finnHub(item)));

    await knex('user').del();
    await knex('symbol').del();
    await knex('trade').del();
    await knex('holding').del();
    await knex('fund').del();
    await knex('watchlist').del();

    try {
        const response = await Promise.allSettled(promises);
        response.map(async mic => {
            const newMic = mic.value.data.map(item => {
                return {
                    symbol: item.symbol,
                    description: item.description,
                    currency: item.currency,
                }
            })
            await knex('symbol').insert(newMic);
        })
        
    } catch (error) {
        console.error(error);
    }

    await knex('user').insert(userData);
    await knex('trade').insert(tradeData);
    await knex('holding').insert(holdingData);
    await knex('fund').insert(fundData);
    await knex('watchlist').insert(watchlistData);
};
