const { v4: uuid } = require('uuid');
const knex = require('knex')(require('../knexfile'));
const dayjs = require('dayjs');
const validation = require('./validation');
const update = require('./update');

const tradeHistory = (req, res) => {
    knex('trade')
        .select('*')
        .where('user_id', req.params.userId)
        .then(data => {
            if (data.length === 0) {
                console.log(data);
                return res
                    .status(404)
                    .json(
                        `The trade history with user id ${req.params.userId} is not found!`
                    );
            } else {
                res.status(200).json(data);
            }
        })
        .catch(err => {
            res.status(400).json(
                `Error retrieving user ${req.params.username} ${err}`
            );
        });
};

const addTrade = (req, res) => {
    let enoughCash = false;
    let enoughShares = false;
    const tradeDetail = req.body;

    if (!validation.tradeTypeValidate(tradeDetail.type)) {
        return res.status(400).send('Invalid trade type');
    }

    const newTrade = { id: uuid(), ...tradeDetail };

    // check if enough cash for buy
    if (newTrade.type === 'buy') {
        knex('user')
            .select('cash_cad', 'cash_usd')
            .where('user_id', newTrade.user_id)
            .then(data => {
                if (data.length === 0) {
                    return res
                        .status(404)
                        .json(
                            `The user with id ${newTrade.user_id} is not found!`
                        );
                } else {
                    const amountRequired = newTrade.price * newTrade.shares;
                    let cashUSD = data[0].cash_usd;
                    let cashCAD = data[0].cash_cad;

                    if (
                        newTrade.currency === 'usd' &&
                        cashUSD >= amountRequired
                    ) {
                        enoughCash = true;
                        cashUSD -= amountRequired;
                    } else if (
                        newTrade.currency === 'cad' &&
                        cashCAD >= amountRequired
                    ) {
                        enoughCash = true;
                        cashCAD -= amountRequired;
                    } else {
                        return res.json('Cash is not enough for buy');
                    }

                    knex('user')
                        .update({
                            cash_cad: cashCAD,
                            cash_usd: cashUSD,
                        })
                        .where('user_id', newTrade.user_id)
                        .then(data => {
                            console.log(data);
                        });
                }
            });
    }

    // check if enough share for sell
    if (newTrade.type === 'sell') {
        knex('holding')
            .select('sell_shares')
            .where('ticker', newTrade.ticker)
            .andWhere('user_id', newTrade.user_id)
            .then(data => {
                if (data.length === 0) {
                    return res
                        .status(404)
                        .json(`The stock with ticker ${ticker} is not found!`);
                } else {
                    if (
                        data[0].buy_shares - data[0].sell_shares >=
                        newTrade.shares
                    ) {
                        enoughShares = true;
                    } else {
                        return res.json('Share is not enough for sell');
                    }
                }
            });
    }

    newTrade.order_status = 'approve';

    if (enoughCash || enoughShares) {
        knex('trade')
            .insert(newTrade)
            .then(data => {
                console.log(data)
            });

        knex('holding')
            .select('avg_price', 'buy_shares', 'sell_shares')
            .where('ticker', newTrade.ticker)
            .andWhere('user_id', newTrade.user_id)
            .then(data => {
                if (data.length === 1) {
                    let newAvg = data[0].avg_price;
                    let buyShares = data[0].buy_shares;
                    let sellShares = data[0].sell_shares;

                    if (newTrade.type === 'buy') {
                        const currentHoldShares =
                            data[0].buy_shares - data[0].sell_shares;
                        newAvg = update.averagePrice(
                            newTrade.price,
                            newTrade.shares,
                            data[0].avg_price,
                            currentHoldShares
                        );
                        buyShares += newTrade.shares;
                    } else {
                        sellShares += newTrade.shares;
                    }

                    knex('holding')
                        .update({
                            avg_price: newAvg,
                            buy_shares: buyShares,
                            sell_shares: sellShares,
                        })
                        .where('ticker', newTrade.ticker)
                        .andWhere('user_id', newTrade.user_id)
                        .then(data => {
                            console.log(data);
                        });
                } else if(data.length === 0) {
                    const newHolding = {
                        user_id: newTrade.user_id,
                        ticker: newTrade.ticker,
                        avg_price: newTrade.price,
                        buy_shares: newTrade.shares,
                        sell_shares: 0,
                        currency: newTrade.currency
                    }
                    knex('holding')
                    .insert(newHolding)
                    .then(data => {
                        console.log(data);
                    })
                } else {
                    return res.status(400).json('Fail to find the holding')
                }
            });
    }
};

module.exports = { tradeHistory, addTrade };
