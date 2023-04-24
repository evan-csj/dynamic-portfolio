const { v4: uuid } = require('uuid');
const knex = require('knex')(require('../knexfile'));
const update = require('./update');

const tradeHistory = (req, res) => {
    knex('trade')
        .select('*')
        .where('user_id', req.params.userId)
        .then(data => {
            if (data.length === 0) {
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

const addTrade = async (req, res) => {
    const { user_id: userId, type, currency, price, shares, ticker } = req.body;
    const validType = ['buy', 'sell'];
    const validCurrency = ['usd', 'cad'];

    if (!validType.includes(type)) {
        return res.status(422).json({ error: 'Invalid funding type' });
    }

    if (!validCurrency.includes(currency)) {
        return res.status(422).json({ error: 'Invalid fund currency' });
    }

    if (isNaN(price) || price <= 0) {
        return res.status(422).json({ error: 'Invalid price' });
    }

    if (isNaN(shares) || shares <= 0) {
        return res.status(422).json({ error: 'Invalid shares' });
    }

    console.log('userid', userId);
    console.log('ticket', ticker);

    try {
        const userData = await knex('user')
            .select('cash_cad', 'cash_usd')
            .where({ id: userId })
            .first();


        const holdingData = await knex('holding')
            .select('buy_shares', 'sell_shares', 'avg_price')
            .where({ user_id: userId })
            .andWhere({ ticker: ticker })
            .first();

        if (!userData || !holdingData)
            return res.status(404).json({ error: 'User not found' });

        let { cash_cad: cashCAD, cash_usd: cashUSD } = userData;
        let {
            buy_shares: buyShares,
            sell_shares: sellShares,
            avg_price: avgPrice,
        } = holdingData;
        const amountRequired = price * shares;

        // check your cash for buy
        if (type === 'buy') {
            if (currency === 'usd' && cashUSD >= amountRequired) {
                cashUSD -= amountRequired;
            } else if (currency === 'cad' && cashCAD >= amountRequired) {
                cashCAD -= amountRequired;
            } else {
                return res.status(422).json({ error: 'Insufficient cash' });
            }
        }

        // check your shares for sell
        if (type === 'sell') {
            const sharesHold = buyShares - sellShares;
            if (sharesHold => shares) {
                sellShares += shares;
            } else {
                return res.status(422).json({ error: 'Insufficient shares' });
            }
        }
        return res.status(200).json('good')
    } catch (error) {
        return res.status(500).json({ error: 'Something went wrong' });
    }

    // const newTrade = { id: uuid(), ...tradeDetail };

    // // check if enough cash for buy
    // if (newTrade.type === 'buy') {
    //     knex('user')
    //         .select('cash_cad', 'cash_usd')
    //         .where('id', newTrade.user_id)
    //         .then(data => {
    //             if (data.length === 0) {
    //                 return res
    //                     .status(404)
    //                     .json(
    //                         `The user with id ${newTrade.user_id} is not found!`
    //                     );
    //             } else {
    //                 const amountRequired = newTrade.price * newTrade.shares;
    //                 let cashUSD = data[0].cash_usd;
    //                 let cashCAD = data[0].cash_cad;

    //                 if (
    //                     newTrade.currency === 'usd' &&
    //                     cashUSD >= amountRequired
    //                 ) {
    //                     enoughCash = true;
    //                     cashUSD -= amountRequired;
    //                 } else if (
    //                     newTrade.currency === 'cad' &&
    //                     cashCAD >= amountRequired
    //                 ) {
    //                     enoughCash = true;
    //                     cashCAD -= amountRequired;
    //                 } else {
    //                     if (newTrade.currency === 'usd')
    //                         return res.json(
    //                             `${cashUSD} USD is not enough for buy ${amountRequired}`
    //                         );

    //                     if (newTrade.currency === 'cad')
    //                         return res.json(
    //                             `${cashCAD} CAD is not enough for buy ${amountRequired}`
    //                         );
    //                 }

    //                 knex('user')
    //                     .update({
    //                         cash_cad: cashCAD,
    //                         cash_usd: cashUSD,
    //                     })
    //                     .where('user_id', newTrade.user_id)
    //                     .then(data => {
    //                         console.log(data);
    //                     });
    //             }
    //         });
    // }

    // // check if enough share for sell
    // if (newTrade.type === 'sell') {
    //     knex('holding')
    //         .select('buy_shares', 'sell_shares')
    //         .where('ticker', newTrade.ticker)
    //         .andWhere('user_id', newTrade.user_id)
    //         .then(data => {
    //             if (data.length === 0) {
    //                 return res
    //                     .status(404)
    //                     .json(`The stock with ticker ${ticker} is not found!`);
    //             } else {
    //                 console.log(data);
    //                 const sharesHold = data[0].buy_shares - data[0].sell_shares;
    //                 if (sharesHold >= newTrade.shares) {
    //                     enoughShares = true;
    //                 } else {
    //                     return res.json(
    //                         `${sharesHold} shares in holding is not enough for sell ${newTrade.shares} shares`
    //                     );
    //                 }
    //             }
    //         });
    // }

    // newTrade.order_status = 'approve';

    // if (enoughCash || enoughShares) {
    //     knex('trade')
    //         .insert(newTrade)
    //         .then(data => {
    //             console.log(data);
    //         });

    //     console.log('debug');
    //     knex('holding')
    //         .select('avg_price', 'buy_shares', 'sell_shares')
    //         .where('ticker', newTrade.ticker)
    //         .andWhere('user_id', newTrade.user_id)
    //         .then(data => {
    //             if (data.length === 1) {
    //                 let newAvg = data[0].avg_price;
    //                 let buyShares = data[0].buy_shares;
    //                 let sellShares = data[0].sell_shares;

    //                 if (newTrade.type === 'buy') {
    //                     const currentHoldShares =
    //                         data[0].buy_shares - data[0].sell_shares;
    //                     newAvg = update.averagePrice(
    //                         newTrade.price,
    //                         newTrade.shares,
    //                         data[0].avg_price,
    //                         currentHoldShares
    //                     );
    //                     buyShares += newTrade.shares;
    //                 } else {
    //                     sellShares += newTrade.shares;
    //                 }

    //                 knex('holding')
    //                     .update({
    //                         avg_price: newAvg,
    //                         buy_shares: buyShares,
    //                         sell_shares: sellShares,
    //                     })
    //                     .where('ticker', newTrade.ticker)
    //                     .andWhere('user_id', newTrade.user_id)
    //                     .then(data => {
    //                         console.log(data);
    //                     });
    //             } else if (data.length === 0) {
    //                 const newHolding = {
    //                     id: uuid(),
    //                     user_id: newTrade.user_id,
    //                     ticker: newTrade.ticker,
    //                     avg_price: newTrade.price,
    //                     buy_shares: newTrade.shares,
    //                     sell_shares: 0,
    //                     currency: newTrade.currency,
    //                 };
    //                 knex('holding')
    //                     .insert(newHolding)
    //                     .then(data => {
    //                         console.log(data);
    //                     });
    //             } else {
    //                 return res.status(400).json('Fail to find the holding');
    //             }
    //         });
    // }
};

module.exports = { tradeHistory, addTrade };
