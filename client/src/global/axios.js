import axios from 'axios';

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

const getTrades = async id => {
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

export { getUser, getHoldings, getTrades, getFunding };
