const averagePrice = (price, shares, prevAvgPrice, prevShares) => {
    const newAvgPrice =
        prevShares > 0
            ? (prevAvgPrice * prevShares + price * shares) /
              (shares + prevShares)
            : price;
    return newAvgPrice;
};

module.exports = { averagePrice };
