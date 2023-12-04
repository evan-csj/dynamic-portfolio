const axios = require('axios');
const knex = require('knex')(require('../knexfile'));
const dayjs = require('dayjs');
require('dotenv').config();
const {
    EX_KEY,
    FINNHUB_KEY,
    POLYGON_KEY,
    ALPHA_VANTAGE_RAPID,
    ALPACA_KEY,
    ALPACA_SECRET,
} = process.env;

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

const polygonAggs = (ticker, multiplier, timespan, from, to) => {
    return {
        method: 'GET',
        url: `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/${multiplier}/${timespan}/${from}/${to}`,
        params: {
            adjusted: 'true',
            sort: 'asc',
            limit: '5000',
            apikey: POLYGON_KEY,
        },
    };
};

// const alphaVantage = symbol => {
//     return {
//         method: 'GET',
//         url: 'https://alpha-vantage.p.rapidapi.com/query',
//         params: {
//             function: 'TIME_SERIES_DAILY_ADJUSTED',
//             symbol: symbol,
//             outputsize: 'full',
//             datatype: 'json',
//         },
//         headers: {
//             'X-RapidAPI-Key': ALPHA_VANTAGE_RAPID,
//             'X-RapidAPI-Host': 'alpha-vantage.p.rapidapi.com',
//         },
//     };
// };

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
        let ohlcArray = [];
        let volumeArray = [];

        for (const {
            o: open,
            h: high,
            l: low,
            c: close,
            v: volume,
            t: time,
        } of resultArray) {
            const color =
                close - open >= 0
                    ? 'rgba(38, 166, 154, 0.5)'
                    : 'rgba(239, 83, 80, 0.5)';
            ohlcArray.push({
                time: dayjs(time).unix(),
                open,
                high,
                low,
                close,
            });
            volumeArray.push({
                time: dayjs(time).unix(),
                value: volume,
                color,
            });
        }

        return res.status(200).json({ ohlc: ohlcArray, v: volumeArray });
    } catch (error) {
        console.error(error);
        return res.status(404).json(error);
    }
};

// const getCandles = async (req, res) => {
//     const { ticker, multiplier, timespan, from, to, scale } = req.query;

//     try {
//         let ohlcArray = [];
//         let volumeArray = [];

//         if (scale === '5Y' || scale === 'ALL') {
//             const response = await axios.request(alphaVantage(ticker));
//             const responseData = response.data['Time Series (Daily)'];

//             for (const [date, data] of Object.entries(responseData)) {
//                 const time = dayjs(date).unix();
//                 const open = parseFloat(data['1. open']);
//                 const high = parseFloat(data['2. high']);
//                 const low = parseFloat(data['3. low']);
//                 const close = parseFloat(data['4. close']);
//                 const closeAdj = parseFloat(data['5. adjusted close']);
//                 const ratio = closeAdj / close;
//                 const openAdj = open * ratio;
//                 const highAdj = high * ratio;
//                 const lowAdj = low * ratio;
//                 const volume = parseInt(data['6. volume']);
//                 const color =
//                     close - open >= 0
//                         ? 'rgba(38, 166, 154, 0.5)'
//                         : 'rgba(239, 83, 80, 0.5)';
//                 ohlcArray.unshift({
//                     time,
//                     open: openAdj,
//                     high: highAdj,
//                     low: lowAdj,
//                     close: closeAdj,
//                 });
//                 volumeArray.unshift({
//                     time,
//                     value: volume,
//                     color,
//                 });
//             }
//         } else {
//             const response = await axios.request(
//                 polygonAggs(ticker, multiplier, timespan, from, to)
//             );

//             const resultArray = response.data.results;

//             for (const {
//                 o: open,
//                 h: high,
//                 l: low,
//                 c: close,
//                 v: volume,
//                 t: time,
//             } of resultArray) {
//                 const color =
//                     close - open >= 0
//                         ? 'rgba(38, 166, 154, 0.5)'
//                         : 'rgba(239, 83, 80, 0.5)';
//                 ohlcArray.push({
//                     time: time / 1000,
//                     open,
//                     high,
//                     low,
//                     close,
//                 });
//                 volumeArray.push({
//                     time: time / 1000,
//                     value: volume,
//                     color,
//                 });
//             }
//         }
//         return res.status(200).json({ ohlc: ohlcArray, v: volumeArray });
//     } catch (error) {
//         return res.status(404).json(error);
//     }
// };

const getQuote = async (req, res) => {
    const { ticker } = req.query;
    try {
        const response = await axios.request(finnHubQuote(ticker));
        return res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
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
        console.error(error);
        return res.status(404).json(error);
    }
};

module.exports = { getCandles, getQuote, getForex };
