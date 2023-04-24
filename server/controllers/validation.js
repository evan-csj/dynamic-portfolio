const tradeTypeValidate = type => {
    if (type === 'buy' || type === 'sell') {
        return true;
    } else {
        return false;
    }
};

const fundTypeValidate = type => {
    if (type === 'deposit' || type === 'withdraw') {
        return true;
    } else {
        return false;
    }
};

module.exports = { tradeTypeValidate, fundTypeValidate };
