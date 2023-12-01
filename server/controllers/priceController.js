const axios = require('axios');
const knex = require('knex')(require('../knexfile'));
const dayjs = require('dayjs');
require('dotenv').config();
const { EX_KEY, FINNHUB_KEY, ALPHA_VANTAGE_RAPID } = process.env;

// const finnHubCandles = (symbol, resolution, from, to) => {
//     return {
//         method: 'GET',
//         url: 'https://finnhub.io/api/v1/stock/candle',
//         params: {
//             symbol: symbol,
//             resolution: resolution,
//             from: from,
//             to: to,
//         },
//         headers: {
//             'X-Finnhub-Token': FINNHUB_KEY,
//         },
//     };
// };

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

const alphaVantage = symbol => {
    return {
        method: 'GET',
        url: 'https://alpha-vantage.p.rapidapi.com/query',
        params: {
            function: 'TIME_SERIES_DAILY',
            symbol: symbol,
            outputsize: 'compact',
            datatype: 'json',
        },
        headers: {
            'X-RapidAPI-Key': ALPHA_VANTAGE_RAPID,
            'X-RapidAPI-Host': 'alpha-vantage.p.rapidapi.com',
        },
    };
};

// const getCandles = async (req, res) => {
//     const { ticker, resolution, from, to } = req.query;

//     try {
//         const response = await axios.request(
//             finnHubCandles(ticker, resolution, from, to)
//         );
//         return res.status(200).json(response.data);
//     } catch (error) {
//         return res.status(404).json(error);
//     }
// };

const getCandles = async (req, res) => {
    const { ticker, resolution, from, to } = req.query;

    try {
        const response = await axios.request(alphaVantage(ticker));
        const responseData = response.data['Time Series (Daily)'];

        let ohlcArray = [];
        let volumeArray = [];
        for (const [date, data] of Object.entries(responseData)) {
            const time = dayjs(date).unix();
            const open = parseFloat(data['1. open']);
            const high = parseFloat(data['2. high']);
            const low = parseFloat(data['3. low']);
            const close = parseFloat(data['4. close']);
            const volume = parseInt(data['5. volume']);
            const color =
                close - open >= 0
                    ? 'rgba(38, 166, 154, 0.5)'
                    : 'rgba(239, 83, 80, 0.5)';
            ohlcArray.unshift({
                time,
                open,
                high,
                low,
                close,
            });
            volumeArray.unshift({
                time,
                value: volume,
                color,
            });
        }

        return res.status(200).json({ ohlc: ohlcArray, v: volumeArray });
    } catch (error) {
        return res.status(404).json(error);
    }
};

const getQuote = async (req, res) => {
    const { ticker } = req.query;
    try {
        const response = await axios.request(finnHubQuote(ticker));
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json(error);
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

module.exports = { getCandles, getQuote, getForex };
