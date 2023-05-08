const axios = require('axios');
const knex = require('knex')(require('../knexfile'));
const dayjs = require('dayjs');
const FUNCTION = 'TIME_SERIES_DAILY_ADJUSTED';
require('dotenv').config();
const { RAPIDAPI_KEY, ALPHA_KEY, EX_KEY } = process.env;

const realstonks = ticker => {
    return {
        method: 'GET',
        url: `https://realstonks.p.rapidapi.com/${ticker}`,
        headers: {
            'X-RapidAPI-Key': `${RAPIDAPI_KEY}`,
        },
    };
};

const twelveData = symbol => {
    return {
        method: 'GET',
        url: 'https://twelve-data1.p.rapidapi.com/price',
        params: {
            symbol: `${symbol}`,
            format: 'json',
            outputsize: '30',
        },
        headers: {
            'X-RapidAPI-Key': `${RAPIDAPI_KEY}`,
        },
    };
};

const getRTPriceAPI = async (req, res) => {
    try {
        const response = await axios.request(realstonks(req.params.ticker));
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json(error);
    }
};

const getRTPrice = async ticker => {
    try {
        const response = await axios.request(realstonks(ticker));
        return response.data;
    } catch (error) {
        return error;
    }
};

const getForex = async (_req, res) => {
    try {
        const exchangeRate = await knex('symbol')
            .select('updated_at', 'last_price')
            .where({ ticker: 'USD/CAD' })
            .first();
        const lastRate = exchangeRate['last_price'];
        const lastUpdateTimestamp = dayjs(exchangeRate['updated_at']);
        const differece = dayjs().diff(lastUpdateTimestamp, 'hour');

        if (differece > 24) {
            const response = await axios.get(
                `https://v6.exchangerate-api.com/v6/${EX_KEY}/latest/USD`
            );
            const rate = response.data['conversion_rates'].CAD;
            res.status(200).json(rate);
            await knex('symbol')
                .where({ ticker: 'USD/CAD' })
                .update({
                    last_price: rate,
                    updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                });
            return;
        } else {
            return res.status(200).json(lastRate);
        }
    } catch (error) {
        return res.status(404).json(error);
    }
};

const getPriceHistory = async (req, res) => {
    axios
        .get(
            `https://www.alphavantage.co/query?function=${FUNCTION}&symbol=${req.params.ticker}&apikey=${ALPHA_KEY}`
        )
        .then(response => {
            return res.status(200).json(response.data);
        });
};

module.exports = { getRTPriceAPI, getRTPrice, getPriceHistory, getForex };
