import axios from 'axios';
const dayjs = require('dayjs');
const API_PORT = 8080;
const API_ADDRESS = `http://localhost:${API_PORT}`;
const newHeader = {
    headers: {
        'Content-Type': 'application/json',
    },
};

const axiosStandard = axios.create({
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

const getUser = async id => {
    try {
        const token = sessionStorage.getItem('JWT');
        const user = await axiosStandard.get(`${API_ADDRESS}/user/${id}`, {
            headers: {
                JWT: `Bearer ${token}`,
            },
        });
        return user;
    } catch (err) {
        console.error('Error:', err);
        return;
    }
};

const getHoldings = async id => {
    try {
        const token = sessionStorage.getItem('JWT');
        const holdings = await axiosStandard.get(
            `${API_ADDRESS}/holding/user/${id}`,
            {
                headers: {
                    JWT: `Bearer ${token}`,
                },
            }
        );
        return holdings;
    } catch (err) {}
};

const getTrading = async id => {
    try {
        const token = sessionStorage.getItem('JWT');
        const trades = await axiosStandard.get(
            `${API_ADDRESS}/trade/user/${id}`,
            {
                headers: {
                    JWT: `Bearer ${token}`,
                },
            }
        );
        return trades;
    } catch (err) {}
};

const getFunding = async id => {
    try {
        const token = sessionStorage.getItem('JWT');
        const funding = await axiosStandard.get(
            `${API_ADDRESS}/fund/user/${id}`,
            {
                headers: {
                    JWT: `Bearer ${token}`,
                },
            }
        );
        return funding;
    } catch (err) {}
};

const getCurrency = async () => {
    try {
        const token = sessionStorage.getItem('JWT');
        const exRate = await axiosStandard.get(`${API_ADDRESS}/price/forex`, {
            headers: {
                JWT: `Bearer ${token}`,
            },
        });
        return exRate;
    } catch (err) {}
};

const getWatchlist = async id => {
    try {
        const token = sessionStorage.getItem('JWT');
        const watchlist = await axiosStandard.get(
            `${API_ADDRESS}/watchlist/user/${id}`,
            {
                headers: {
                    JWT: `Bearer ${token}`,
                },
            }
        );
        return watchlist;
    } catch (err) {}
};

const getPriceHistory = async (ticker, scale) => {
    const currentMoment = dayjs();
    const currentYear = currentMoment.year();
    const currentMonth = currentMoment.month();
    const dayOfWeek = currentMoment.day();
    const currentHour = currentMoment.hour();
    const currentMinute = currentMoment.minute();

    const timeframe = {
        '1D': '1Min',
        '5D': '5Min',
        '1M': '30Min',
        '3M': '1H',
        '6M': '2H',
        YTD: '1D',
        '1Y': '1D',
        '5Y': '1W',
        ALL: '1M',
    };

    const isOpen = !(
        currentHour < 6 ||
        (currentHour === 6 && currentMinute < 30) ||
        dayOfWeek === 0 ||
        dayOfWeek === 6
    );

    const lastOpenDayOfWeek = isOpen
        ? dayOfWeek
        : dayOfWeek === 0 || dayOfWeek === 1
        ? -2
        : dayOfWeek - 1;

    const fromDate = {
        '1D': currentMoment.day(lastOpenDayOfWeek).format('YYYY-MM-DD'),
        '5D': currentMoment.day(dayOfWeek - 7).format('YYYY-MM-DD'),
        '1M': currentMoment.month(currentMonth - 1).format('YYYY-MM-DD'),
        '3M': currentMoment.month(currentMonth - 3).format('YYYY-MM-DD'),
        '6M': currentMoment.month(currentMonth - 6).format('YYYY-MM-DD'),
        YTD: `${currentYear}-01-01`,
        '1Y': currentMoment.year(currentYear - 1).format('YYYY-MM-DD'),
        '5Y': currentMoment.year(currentYear - 5).format('YYYY-MM-DD'),
        ALL: '1970-01-01',
    };

    const toDate = currentMoment.format('YYYY-MM-DD');

    const candlesParameters = {
        ticker,
        timeframe: timeframe[scale],
        from: fromDate[scale],
        to: toDate,
        scale,
    };

    try {
        const token = sessionStorage.getItem('JWT');
        const priceHistory = await axiosStandard.get(
            `${API_ADDRESS}/price/candles`,
            {
                params: candlesParameters,
                headers: {
                    JWT: `Bearer ${token}`,
                },
            }
        );

        return priceHistory;
    } catch (err) {}
};

// const getPriceHistory = async (ticker, scale) => {
//     const currentMoment = dayjs();
//     const currentYear = currentMoment.year();
//     const currentMonth = currentMoment.month();
//     const dayOfWeek = currentMoment.day();
//     const currentHour = currentMoment.hour();
//     const currentMinute = currentMoment.minute();

//     const multiplier = {
//         '1D': 1,
//         '5D': 5,
//         '1M': 1,
//         '3M': 1,
//         '6M': 1,
//         YTD: 1,
//         '1Y': 1,
//         '5Y': 1,
//         ALL: 1,
//     };

//     const timespan = {
//         '1D': 'minute',
//         '5D': 'minute',
//         '1M': 'day',
//         '3M': 'day',
//         '6M': 'day',
//         YTD: 'day',
//         '1Y': 'day',
//         '5Y': 'week',
//         ALL: 'month',
//     };

//     const isOpen = !(
//         currentHour < 6 ||
//         (currentHour === 6 && currentMinute < 30) ||
//         dayOfWeek === 0 ||
//         dayOfWeek === 6
//     );

//     const lastOpenDayOfWeek = isOpen
//         ? dayOfWeek
//         : dayOfWeek === 0 || dayOfWeek === 1
//         ? -2
//         : dayOfWeek - 1;

//     const fromDate = {
//         '1D': currentMoment.day(lastOpenDayOfWeek).format('YYYY-MM-DD'),
//         '5D': currentMoment.day(dayOfWeek - 7).format('YYYY-MM-DD'),
//         '1M': currentMoment.month(currentMonth - 1).format('YYYY-MM-DD'),
//         '3M': currentMoment.month(currentMonth - 3).format('YYYY-MM-DD'),
//         '6M': currentMoment.month(currentMonth - 6).format('YYYY-MM-DD'),
//         YTD: `${currentYear}-01-01`,
//         '1Y': currentMoment.year(currentYear - 1).format('YYYY-MM-DD'),
//         '5Y': currentMoment.year(currentYear - 5).format('YYYY-MM-DD'),
//         ALL: '1970-01-01',
//     };

//     const toDate = currentMoment.format('YYYY-MM-DD');

//     const candlesParameters = {
//         ticker,
//         multiplier: multiplier[scale],
//         timespan: timespan[scale],
//         from: fromDate[scale],
//         to: toDate,
//         scale,
//     };

//     try {
//         const priceHistory = await axiosStandard.get(
//             `${API_ADDRESS}/price/candles`,
//             {
//                 params: candlesParameters,
//             }
//         );

//         return priceHistory;
//     } catch (err) {}
// };

const getLastPrice = async ticker => {
    try {
        const token = sessionStorage.getItem('JWT');
        const lastPrice = await axiosStandard.get(
            `${API_ADDRESS}/price/quote`,
            {
                params: {
                    ticker: ticker,
                },
                headers: {
                    JWT: `Bearer ${token}`,
                },
            }
        );
        return lastPrice;
    } catch (err) {}
};

const getSymbols = async () => {
    try {
        const token = sessionStorage.getItem('JWT');
        const symbols = await axiosStandard.get(`${API_ADDRESS}/symbols`, {
            headers: {
                JWT: `Bearer ${token}`,
            },
        });
        return symbols;
    } catch (err) {}
};

const putSymbolInfo = async symbolInfo => {
    try {
        const token = sessionStorage.getItem('JWT');
        const response = await axiosStandard.put(
            `${API_ADDRESS}/symbols/info`,
            symbolInfo,
            {
                headers: {
                    JWT: `Bearer ${token}`,
                },
            }
        );
        return response;
    } catch (err) {}
};

const putSymbolPrice = async symbolPrice => {
    try {
        const token = sessionStorage.getItem('JWT');
        const response = await axiosStandard.put(
            `${API_ADDRESS}/symbols/price`,
            symbolPrice,
            {
                headers: {
                    JWT: `Bearer ${token}`,
                },
            }
        );
        return response;
    } catch (err) {}
};

const getPortfolio = async id => {
    try {
        const token = sessionStorage.getItem('JWT');
        const portfolio = await axiosStandard.get(
            `${API_ADDRESS}/portfolio/user/${id}`,
            {
                headers: {
                    JWT: `Bearer ${token}`,
                },
            }
        );
        return portfolio;
    } catch (err) {}
};

const getCompanyProfile = async ticker => {
    try {
        const token = sessionStorage.getItem('JWT');
        const profile = await axiosStandard.get(`${API_ADDRESS}/stat/profile`, {
            params: {
                ticker: ticker,
            },
            headers: {
                JWT: `Bearer ${token}`,
            },
        });
        return profile;
    } catch (err) {}
};

const getEps = async ticker => {
    try {
        const token = sessionStorage.getItem('JWT');
        const eps = await axiosStandard.get(`${API_ADDRESS}/stat/eps`, {
            params: {
                ticker: ticker,
            },
            headers: {
                JWT: `Bearer ${token}`,
            },
        });
        return eps;
    } catch (err) {}
};

const getTrends = async ticker => {
    try {
        const token = sessionStorage.getItem('JWT');
        const eps = await axiosStandard.get(`${API_ADDRESS}/stat/trends`, {
            params: {
                ticker: ticker,
            },
            headers: {
                JWT: `Bearer ${token}`,
            },
        });
        return eps;
    } catch (err) {}
};

const putPortfolio = async (id, dp) => {
    try {
        const token = sessionStorage.getItem('JWT');
        const response = await axiosStandard.put(
            `${API_ADDRESS}/portfolio/user/${id}`,
            dp,
            {
                headers: {
                    JWT: `Bearer ${token}`,
                },
            }
        );
        return response;
    } catch (err) {}
};

const postFunding = async funding => {
    try {
        const token = sessionStorage.getItem('JWT');
        const newFunding = await axiosStandard.post(
            `${API_ADDRESS}/fund`,
            funding,
            {
                headers: {
                    JWT: `Bearer ${token}`,
                },
            }
        );
        return newFunding;
    } catch (err) {}
};

const postTrading = async trading => {
    try {
        const token = sessionStorage.getItem('JWT');
        const newTrading = await axiosStandard.post(
            `${API_ADDRESS}/trade`,
            trading,
            {
                headers: {
                    JWT: `Bearer ${token}`,
                },
            }
        );
        return newTrading;
    } catch (err) {}
};

const addWatchItem = async item => {
    try {
        const token = sessionStorage.getItem('JWT');
        const newItem = await axiosStandard.post(
            `${API_ADDRESS}/watchlist`,
            item,
            {
                headers: {
                    JWT: `Bearer ${token}`,
                },
            }
        );
        return newItem;
    } catch (err) {}
};

const deleteWatchItem = async item => {
    try {
        const token = sessionStorage.getItem('JWT');
        const deleteItem = await axiosStandard.put(
            `${API_ADDRESS}/watchlist`,
            item,
            {
                headers: {
                    JWT: `Bearer ${token}`,
                },
            }
        );
        return deleteItem;
    } catch (err) {}
};

const getFeedback = async text => {
    const newMessage = {
        text: text,
    };

    try {
        const token = sessionStorage.getItem('JWT');
        const response = await axiosStandard.post(
            `${API_ADDRESS}/chatbot`,
            newMessage,
            {
                headers: {
                    JWT: `Bearer ${token}`,
                },
            }
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
        const isCorrect = await axiosStandard.put(
            `${API_ADDRESS}/user`,
            userInput
        );
        return isCorrect;
    } catch (err) {
        return err.response;
    }
};

const logout = () => {
    try {
        axios.get(`${API_ADDRESS}/auth/logout`);
    } catch (err) {}
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
    addWatchItem,
    deleteWatchItem,
    getFeedback,
    checkUserPassword,
    logout,
};
