const knex = require('knex')(require('../knexfile'));
const priceController = require('./priceController');

const selectHolding = userId =>
    knex('holding')
        .select(
            'id',
            'user_id',
            'ticker',
            'avg_price',
            'buy_shares',
            'sell_shares',
            'currency'
        )
        .where('user_id', userId);

const getHolding = (req, res) => {
    const userId = req.params.userId;
    selectHolding(userId)
        .then(data => {
            if (data.length === 0) {
                return res
                    .status(404)
                    .json(`The holding with user id ${userId} is not found!`);
            } else {
                res.status(200).json(data);
            }
        })
        .catch(err => {
            res.status(400).json(`Error retrieving user id ${userId} ${err}`);
        });
};

const getTotalValue = async (req, res) => {
    const userId = req.params.userId;
    let totalValue = { usd: 0, cad: 0 };

    try {
        const holdingList = await selectHolding(userId);
        if (!holdingList)
            return res
                .status(404)
                .json({ error: `User with id ${userId} not found` });
        const tickerArray =
            holdingList.map(item => item.ticker).join(',') + ',USD/CAD';
        const realTimePrice = await priceController.getPriceRealTime(
            tickerArray
        );
        holdingList.map(item => {
            const shares = item.buy_shares - item.sell_shares;
            if (item.currency === 'cad') {
                totalValue.cad +=
                    shares *
                    realTimePrice[item.ticker].price *
                    realTimePrice['USD/CAD'].price;
            } else {
                totalValue.usd += shares * realTimePrice[item.ticker].price;
            }
        });
        return res.status(200).json(totalValue);
    } catch (error) {
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

module.exports = { getHolding, getTotalValue };
