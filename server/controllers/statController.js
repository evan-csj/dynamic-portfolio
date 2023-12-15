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

const finnHubEps = symbol => {
    return {
        method: 'GET',
        url: 'https://finnhub.io/api/v1/stock/earnings',
        params: {
            symbol: symbol,
        },
        headers: {
            'X-Finnhub-Token': FINNHUB_KEY,
        },
    };
};

const finnHubTrends = symbol => {
    return {
        method: 'GET',
        url: 'https://finnhub.io/api/v1/stock/recommendation',
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
        console.error('Error:', error);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

const getEps = async (req, res) => {
    const { ticker } = req.query;
    try {
        const response = await axios.request(finnHubEps(ticker));
        return res.status(200).json(response.data);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

const getTrends = async (req, res) => {
    const { ticker } = req.query;
    try {
        const response = await axios.request(finnHubTrends(ticker));
        return res.status(200).json(response.data);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

module.exports = { getCompanyProfile, getEps, getTrends };
