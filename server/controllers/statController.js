const axios = require('axios');
require('dotenv').config();
const { FINNHUB_KEY } = process.env;

const finnHubCompanyProfile = symbol => {
    return {
        method: 'GET',
        url: 'https://finnhub.io/api/v1/stock/profile2',
        params: {
            symbol: symbol,
        },
        headers: {
            'X-Finnhub-Token': FINNHUB_KEY,
        },
    };
};

const getCompanyProfile = async (req, res) => {
    const { ticker } = req.query;
    try {
        const response = await axios.request(finnHubCompanyProfile(ticker));
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json(error);
    }
};

module.exports = { getCompanyProfile };
