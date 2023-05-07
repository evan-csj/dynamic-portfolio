const axios = require('axios');
const FUNCTION = 'TIME_SERIES_DAILY_ADJUSTED';
require('dotenv').config();
const { RAPIDAPI_KEY, ALPHA_KEY } = process.env;

const getOptions = tickers => {
    return {
        method: 'GET',
        url: 'https://twelve-data1.p.rapidapi.com/price',
        params: {
            symbol: `${tickers}`,
            format: 'json',
            outputsize: '30',
        },
        headers: {
            'X-RapidAPI-Key': `${RAPIDAPI_KEY}`,
            'X-RapidAPI-Host': 'twelve-data1.p.rapidapi.com',
        },
    };
};

const getRTPriceAPI = async (req, res) => {
    try {
        const response = await axios.request(getOptions(req.query.tickers));
        return res.status(200).json(response);
    } catch (error) {
        return res.status(404).json(error);
    }
};

const getRTPrice = async tickers => {
    try {
        const response = await axios.request(getOptions(tickers));
        return response;
    } catch (error) {
        return error;
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

module.exports = { getRTPriceAPI, getRTPrice, getPriceHistory };
