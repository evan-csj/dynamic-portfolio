const averagePrice = (price, shares, prevAvgPrice, prevShares) => {
    const newAvgPrice =
        (prevAvgPrice * prevShares + price * shares) / (shares + prevShares);
    return newAvgPrice;
};

module.exports = { averagePrice };
