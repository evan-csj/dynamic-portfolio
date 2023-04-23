const tradeTypeValidate = type => {
    if (type === 'buy' || type === 'sell') {
        return true;
    } else {
        return false;
    }
};

module.exports = { tradeTypeValidate };
