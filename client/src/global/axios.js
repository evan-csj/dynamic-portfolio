import axios from 'axios';

const API_PORT = 8080;
const API_ADDRESS = `http://localhost:${API_PORT}`;
const newHeader = {
    headers: {
        'Content-Type': 'application/json',
    },
};

export const getUser = async id => {
    try {
        const user = await axios.get(`${API_ADDRESS}/user/${id}`);
        return user;
    } catch (err) {}
};

export const getHoldings = async id => {
    try {
        const holdings = await axios.get(`${API_ADDRESS}/holding/user/${id}`);
        return holdings;
    } catch (err) {}
};
