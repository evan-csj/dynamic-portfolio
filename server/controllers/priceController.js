const axios = require('axios');
const FUNCTION = 'TIME_SERIES_DAILY_ADJUSTED';
require('dotenv').config();
const { REALSTONKS_KEY, ALPHA_KEY } = process.env;

const getPriceCurrent = async (req, res) => {
    const options = {
        method: 'GET',
        url: `https://realstonks.p.rapidapi.com/${req.params.ticker}`,
        headers: {
            'X-RapidAPI-Key': `${REALSTONKS_KEY}`,
            'X-RapidAPI-Host': 'realstonks.p.rapidapi.com',
        },
    };

    try {
        const response = await axios.request(options);
        return res.status(200).json(response.data);
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

module.exports = { getPriceCurrent, getPriceHistory };
