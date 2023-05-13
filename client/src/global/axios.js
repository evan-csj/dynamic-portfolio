import axios from 'axios';
const dayjs = require('dayjs');
const API_PORT = 8080;
const API_ADDRESS = `http://localhost:${API_PORT}`;
const newHeader = {
    headers: {
        'Content-Type': 'application/json',
    },
};

const getUser = async id => {
    try {
        const user = await axios.get(`${API_ADDRESS}/user/${id}`);
        return user;
    } catch (err) {}
};

const getHoldings = async id => {
    try {
        const holdings = await axios.get(`${API_ADDRESS}/holding/user/${id}`);
        return holdings;
    } catch (err) {}
};

const getTrading = async id => {
    try {
        const trades = await axios.get(`${API_ADDRESS}/trade/user/${id}`);
        return trades;
    } catch (err) {}
};

const getFunding = async id => {
    try {
        const funding = await axios.get(`${API_ADDRESS}/fund/user/${id}`);
        return funding;
    } catch (err) {}
};

const getRTPrice = async ticker => {
    try {
        const priceRT = await axios.get(`${API_ADDRESS}/price/realtime/${ticker}`);
        return priceRT;
    } catch (err) {}
};

const getHoldingRTPrice = async id => {
    try {
        const totalValue = await axios.get(`${API_ADDRESS}/holding/user/${id}/rtprice`);
        return totalValue;
    } catch (err) {}
};

const getCurrency = async () => {
    try {
        const exRate = await axios.get(`${API_ADDRESS}/price/forex`);
        return exRate;
    } catch (err) {}
};

const getWatchlist = async id => {
    try {
        const watchlist = await axios.get(`${API_ADDRESS}/watchlist/user/${id}`);
        return watchlist;
    } catch (err) {}
};

const getRTWatchlist = async id => {
    try {
        const watchlist = await axios.get(`${API_ADDRESS}/watchlist/user/${id}/rtprice`);
        return watchlist;
    } catch (err) {}
};

const getPriceHistory = async (ticker, scale) => {
    const today = dayjs().unix();
    const year = 31536000;
    const factor = scale === '5Y' ? 5 : 1;
    const resolution = scale === '5Y' ? 'W' : 'D';
    try {
        const priceHistory = await axios.get(`${API_ADDRESS}/price/history`, {
            params: {
                ticker: ticker,
                resolution: resolution,
                from: today - factor * year,
                to: today,
            },
        });
        return priceHistory;
    } catch (err) {}
};

const getSymbols = () => {
    try {
        const symbols = axios.get(`${API_ADDRESS}/symbols`);
        return symbols;
    } catch (err) {}
};

const postFunding = async funding => {
    try {
        const newFunding = axios.post(`${API_ADDRESS}/fund`, funding, newHeader);
        return newFunding;
    } catch (err) {}
};

const postTrading = async trading => {
    try {
        const newTrading = axios.post(`${API_ADDRESS}/trade`, trading, newHeader);
        return newTrading;
    } catch (err) {}
};

export {
    getUser,
    getHoldings,
    getTrading,
    getFunding,
    getRTPrice,
    getHoldingRTPrice,
    getCurrency,
    getWatchlist,
    getRTWatchlist,
    getPriceHistory,
    getSymbols,
    postFunding,
    postTrading,
};
