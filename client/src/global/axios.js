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
        const token = sessionStorage.getItem('authToken');
        const user = await axios.get(`${API_ADDRESS}/user/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return user;
    } catch (err) {}
};

const getHoldings = async id => {
    try {
        const token = sessionStorage.getItem('authToken');
        const holdings = await axios.get(`${API_ADDRESS}/holding/user/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
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

const getCurrency = async () => {
    try {
        const exRate = await axios.get(`${API_ADDRESS}/price/forex`);
        return exRate;
    } catch (err) {}
};

const getWatchlist = async id => {
    try {
        const token = sessionStorage.getItem('authToken');
        const watchlist = await axios.get(
            `${API_ADDRESS}/watchlist/user/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return watchlist;
    } catch (err) {}
};

const getPriceHistory = async (ticker, scale) => {
    const today = dayjs().unix();
    const dayUnix = 60 * 60 * 24;
    const monthUnix = dayUnix * 30;
    const yearUnix = dayUnix * 365;
    const dateRange = {
        '1D': dayUnix,
        '5D': dayUnix * 7,
        '1M': monthUnix,
        '3M': monthUnix * 3,
        '6M': monthUnix * 6,
        '1Y': yearUnix,
        '5Y': yearUnix * 5,
    };
    const resolution = {
        '1D': '1',
        '5D': '5',
        '1M': '30',
        '3M': 'D',
        '6M': 'D',
        '1Y': 'D',
        '5Y': 'W',
    };
    try {
        const priceHistory = await axios.get(`${API_ADDRESS}/price/candles`, {
            params: {
                ticker: ticker,
                resolution: resolution[scale],
                from: today - dateRange[scale],
                to: today,
            },
        });
        return priceHistory;
    } catch (err) {}
};

const getLastPrice = async ticker => {
    try {
        const lastPrice = await axios.get(`${API_ADDRESS}/price/quote`, {
            params: {
                ticker: ticker,
            },
        });
        return lastPrice;
    } catch (err) {}
};

const getSymbols = async () => {
    try {
        const symbols = await axios.get(`${API_ADDRESS}/symbols`);
        return symbols;
    } catch (err) {}
};

const putSymbolInfo = async symbolInfo => {
    try {
        const response = await axios.put(
            `${API_ADDRESS}/symbols/info`,
            symbolInfo,
            newHeader
        );
        return response;
    } catch (err) {}
};

const putSymbolPrice = async symbolPrice => {
    try {
        const response = await axios.put(
            `${API_ADDRESS}/symbols/price`,
            symbolPrice,
            newHeader
        );
        return response;
    } catch (err) {}
};

const getPortfolio = async id => {
    try {
        const portfolio = await axios.get(
            `${API_ADDRESS}/portfolio/user/${id}`
        );
        return portfolio;
    } catch (err) {}
};

const getCompanyProfile = async ticker => {
    try {
        const profile = await axios.get(`${API_ADDRESS}/stat/profile`, {
            params: {
                ticker: ticker,
            },
        });
        return profile;
    } catch (err) {}
};

const getEps = async ticker => {
    try {
        const eps = await axios.get(`${API_ADDRESS}/stat/eps`, {
            params: {
                ticker: ticker,
            },
        });
        return eps;
    } catch (err) {}
};

const getTrends = async ticker => {
    try {
        const eps = await axios.get(`${API_ADDRESS}/stat/trends`, {
            params: {
                ticker: ticker,
            },
        });
        return eps;
    } catch (err) {}
};

const putPortfolio = async (id, dp) => {
    try {
        const response = await axios.put(
            `${API_ADDRESS}/portfolio/user/${id}`,
            dp,
            newHeader
        );
        return response;
    } catch (err) {}
};

const postFunding = async funding => {
    try {
        const newFunding = await axios.post(
            `${API_ADDRESS}/fund`,
            funding,
            newHeader
        );
        return newFunding;
    } catch (err) {}
};

const postTrading = async trading => {
    try {
        const newTrading = await axios.post(
            `${API_ADDRESS}/trade`,
            trading,
            newHeader
        );
        return newTrading;
    } catch (err) {}
};

const postWatchItem = async item => {
    try {
        const newItem = await axios.post(
            `${API_ADDRESS}/watchlist`,
            item,
            newHeader
        );
        return newItem;
    } catch (err) {}
};

const deleteWatchItem = async id => {
    try {
        const deleteItem = await axios.delete(`${API_ADDRESS}/watchlist/${id}`);
        return deleteItem;
    } catch (err) {}
};

const getFeedback = async text => {
    const newMessage = {
        text: text,
    };

    try {
        const response = await axios.post(
            `${API_ADDRESS}/chatbot`,
            newMessage,
            newHeader
        );
        return response;
    } catch (err) {
        return err.response;
    }
};

const checkUserPassword = async login => {
    const userInput = {
        username: login.username,
        password: login.password,
    };
    try {
        const isCorrect = await axios.put(
            `${API_ADDRESS}/user`,
            userInput,
            newHeader
        );
        return isCorrect;
    } catch (err) {
        return err.response;
    }
};

export {
    getUser,
    getHoldings,
    getTrading,
    getFunding,
    getCurrency,
    getWatchlist,
    getPriceHistory,
    getLastPrice,
    getSymbols,
    putSymbolInfo,
    putSymbolPrice,
    getPortfolio,
    getEps,
    getCompanyProfile,
    getTrends,
    putPortfolio,
    postFunding,
    postTrading,
    postWatchItem,
    deleteWatchItem,
    getFeedback,
    checkUserPassword,
};
