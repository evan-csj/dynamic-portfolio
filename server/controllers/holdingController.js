const knex = require('knex')(require('../knexfile'));
const priceController = require('./priceController');

const selectHolding = userId =>
    knex('holding')
        .select(
            'id',
            'user_id',
            'ticker',
            'avg_price',
            'last_price',
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

const getHoldingRTPrice = async (req, res) => {
    const userId = req.params.userId;

    try {
        const holdingList = await selectHolding(userId);
        if (!holdingList)
            return res
                .status(404)
                .json({ error: `User with id ${userId} not found` });

        const tickerArray =
            holdingList.map(item => item.ticker).join(',') + ',USD/CAD';

        const realTimePrice = await priceController.getRTPrice(tickerArray);
        if (realTimePrice.data.status === 'error') {
            let lastPriceList = {};
            holdingList.forEach(item => {
                lastPriceList[item.ticker] = { price: item.last_price };
            });
            return res.status(200).json(lastPriceList);
        }
        return res.status(200).json(realTimePrice.data);
    } catch (error) {
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

module.exports = { getHolding, getHoldingRTPrice };
