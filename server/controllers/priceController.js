const axios = require('axios');
const knex = require('knex')(require('../knexfile'));
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
require('dotenv').config();
const { FINNHUB_KEY, POLYGON_KEY, ALPACA_KEY, ALPACA_SECRET } = process.env;

const finnHubQuote = symbol => {
    return {
        method: 'GET',
        url: 'https://finnhub.io/api/v1/quote',
        params: {
            symbol: symbol,
        },
        headers: {
            'X-Finnhub-Token': FINNHUB_KEY,
        },
    };
};

const polygonForex = convert => {
    const today = dayjs().format('YYYY-MM-DD');
    return {
        method: 'GET',
        url: `https://api.polygon.io/v2/aggs/ticker/C:${convert}/range/1/minute/${today}/${today}`,
        params: {
            adjusted: 'true',
            sort: 'desc',
            limit: '1',
            apikey: POLYGON_KEY,
        },
    };
};

const alpaca = (symbol, timeframe, from) => {
    return {
        method: 'GET',
        url: 'https://data.alpaca.markets/v2/stocks/bars',
        params: {
            symbols: symbol,
            timeframe,
            start: from + 'T08:00:00Z',
            limit: 10000,
            adjustment: 'split',
            feed: 'sip',
            sort: 'asc',
        },
        headers: {
            accept: 'application/json',
            'APCA-API-KEY-ID': ALPACA_KEY,
            'APCA-API-SECRET-KEY': ALPACA_SECRET,
        },
    };
};

const getCandles = async (req, res) => {
    const { ticker, timeframe, from } = req.query;

    try {
        const response = await axios.request(alpaca(ticker, timeframe, from));

        const resultArray = response.data.bars[ticker];

        return res.status(200).json(resultArray);
    } catch (error) {
        console.error('Error:', error);
        return res.status(404).json(error);
    }
};

const getQuote = async (req, res) => {
    dayjs.extend(utc);
    const { ticker } = req.query;
    try {
        const response = await axios.request(finnHubQuote(ticker));
        const { p: price, pc: prevClose } = response.data;
        const updatePrice = {
            price,
            prev_close: prevClose,
            updated_at: dayjs().utc().format('YYYY-MM-DD HH:mm:ss'),
        };
        res.status(200).json(response.data);
        await knex('symbol').where({ symbol: ticker }).update(updatePrice);
        return;
    } catch (error) {
        console.error('Error:', error);
        return res.status(404).json(error);
    }
};

const getForex = async (_req, res) => {
    dayjs.extend(utc);
    try {
        const exchangeRate = await knex('forex')
            .select('updated_at', 'last_price')
            .where({ symbol: 'USD/CAD' })
            .first();

        const lastRate = exchangeRate['last_price'];
        const lastUpdateTimestamp = dayjs(exchangeRate['updated_at']);
        const diff = dayjs().diff(lastUpdateTimestamp, 'second');

        if (diff > 60) {
            const response = await axios.request(polygonForex('USDCAD'));
            const rate = response.data.results[0].vw;
            res.status(200).json(rate);
            await knex('forex')
                .where({ symbol: 'USD/CAD' })
                .update({
                    last_price: rate,
                    updated_at: dayjs().utc().format('YYYY-MM-DD HH:mm:ss'),
                });
            return;
        } else {
            return res.status(200).json(lastRate);
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(404).json(error);
    }
};

module.exports = { getCandles, getQuote, getForex };
