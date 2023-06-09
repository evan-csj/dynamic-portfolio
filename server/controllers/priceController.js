const axios = require('axios');
const knex = require('knex')(require('../knexfile'));
const dayjs = require('dayjs');
require('dotenv').config();
const { RAPIDAPI_KEY, EX_KEY, FINNHUB_KEY } = process.env;

const realstonks = symbol => {
    return {
        method: 'GET',
        url: `https://realstonks.p.rapidapi.com/${symbol}`,
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

const finnHub = (symbol, resolution, from, to) => {
    return {
        method: 'GET',
        url: 'https://finnhub.io/api/v1/stock/candle',
        params: {
            symbol: symbol,
            resolution: resolution,
            from: from,
            to: to,
        },
        headers: {
            'X-Finnhub-Token': FINNHUB_KEY,
        },
    };
};

const getPriceHistory = async (req, res) => {
    const { ticker, resolution, from, to } = req.query;

    try {
        const response = await axios.request(finnHub(ticker, resolution, from, to));
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json(error);
    }
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
        const exchangeRate = await knex('forex')
            .select('updated_at', 'last_price')
            .where({ symbol: 'USD/CAD' })
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
            await knex('forex')
                .where({ symbol: 'USD/CAD' })
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

module.exports = { getRTPriceAPI, getRTPrice, getPriceHistory, getForex };
