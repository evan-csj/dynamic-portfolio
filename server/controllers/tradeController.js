const { v1 } = require('uuid');
const knex = require('knex')(require('../knexfile'));
const update = require('./update');

const tradeHistory = (req, res) => {
    knex('trade')
        .select('*')
        .where('user_id', req.params.userId)
        .orderBy('created_at', 'desc')
        .then(data => {
            if (data.length === 0) {
                return res
                    .status(404)
                    .json(`The trade history with user id ${req.params.userId} is not found!`);
            } else {
                res.status(200).json(data);
            }
        })
        .catch(err => {
            res.status(400).json(`Error retrieving user ${req.params.username} ${err}`);
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

    try {
        const userData = await knex('user')
            .select('cash_cad', 'cash_usd')
            .where({ id: userId })
            .first();

        if (!userData) return res.status(404).json({ error: `User with id ${userId} not found` });

        const holdingData = await knex('holding')
            .select('buy_shares', 'sell_shares', 'avg_price')
            .where({ user_id: userId })
            .andWhere({ ticker: ticker })
            .first();

        if (!holdingData && type === 'sell') {
            return res.status(404).json({ error: `Ticker ${ticker} not found` });
        } else if (!holdingData && type === 'buy') {
            const newHolding = {
                id: userId + '-' + ticker,
                user_id: userId,
                ticker: ticker,
                last_price: 0,
                avg_price: 0,
                buy_shares: 0,
                sell_shares: 0,
                currency: currency,
            };
            await knex('holding').insert(newHolding);
        }

        let { cash_cad: cashCAD, cash_usd: cashUSD } = userData;
        let {
            buy_shares: buyShares,
            sell_shares: sellShares,
            avg_price: avgPrice,
        } = holdingData || { buy_shares: 0, sell_shares: 0, avg_price: 0 };

        const amountRequired = price * shares;
        const sharesHold = buyShares - sellShares;

        // check your cash for buy and update cash and holding
        if (type === 'buy') {
            if (currency === 'usd' && cashUSD >= amountRequired) {
                cashUSD -= amountRequired;
            } else if (currency === 'cad' && cashCAD >= amountRequired) {
                cashCAD -= amountRequired;
            } else {
                return res.status(422).json({ error: 'Insufficient cash' });
            }

            buyShares += shares;
            newAvg = update.averagePrice(price, shares, avgPrice, sharesHold);
        }

        // check your shares for sell and update cash and holding
        if (type === 'sell') {
            if (sharesHold >= shares) {
                sellShares += shares;
            } else {
                return res.status(422).json({ error: 'Insufficient shares' });
            }
            if (currency === 'usd') cashUSD += amountRequired;
            if (currency === 'cad') cashCAD += amountRequired;
        }

        await knex('user').update({ cash_usd: cashUSD, cash_cad: cashCAD }).where({ id: userId });

        await knex('holding')
            .update({
                buy_shares: buyShares,
                sell_shares: sellShares,
                avg_price: newAvg,
            })
            .where({ user_id: userId })
            .andWhere({ ticker: ticker });

        const newTrade = { id: v1(), ...req.body };
        newTrade.order_status = 'approved';
        await knex('trade').insert(newTrade);

        return res.status(200).json({
            user: { id: userId, cash_usd: cashUSD, cash_cad: cashCAD },
            holding: {
                id: userId,
                ticker: ticker,
                buy_shares: buyShares,
                sell_shares: sellShares,
                avg_price: newAvg,
            },
        });
    } catch (error) {
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

module.exports = { tradeHistory, addTrade };
