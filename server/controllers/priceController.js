const axios = require('axios');
const ALPHA_ADDRESS = 'https://www.alphavantage.co';
const FUNCTION = 'TIME_SERIES_DAILY_ADJUSTED';
require('dotenv').config();
const { API_KEY } = process.env;

const getPrice = async (req, res) => {
    axios
        .get(
            `${ALPHA_ADDRESS}/query?function=${FUNCTION}&symbol=${req.params.ticker}&apikey=${API_KEY}`
        )
        .then(response => {
            const data = response.data['Time Series (Daily)'];
            console.log(data["2023-05-04"]["1. open"]);
            return res.status(200).json(response.data);
        });
};

module.exports = { getPrice };
