const knex = require('knex')(require('../knexfile'));
const priceController = require('./priceController');

const selectHolding = userId =>
    knex('holding')
        .select(
            'id',
            'user_id',
            'holding.ticker',
            'avg_price',
            'last_price',
            'buy_shares',
            'sell_shares',
            'currency'
        )
        .join('symbol', { 'symbol.ticker': 'holding.ticker' })
        .where('user_id', userId);

const getHolding = (req, res) => {
    const userId = req.params.userId;
    selectHolding(userId)
        .then(data => {
            if (data.length === 0) {
                return res.status(404).json(`The holding with user id ${userId} is not found!`);
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
            return res.status(404).json({ error: `User with id ${userId} not found` });

        const promises = holdingList.map(item => {
            return priceController.getRTPrice(item.ticker);
        });

        Promise.allSettled(promises)
            .then(response => {
                const holdingListWithRTPrice = holdingList.map((item, index) => {
                    item['last_price'] = response[index].value.price;
                    return item;
                });
                return res.status(200).json(holdingListWithRTPrice);
            })
            .catch(_err => {
                return res.status(429).json({ error: 'Some promises fail' });
            });
    } catch (error) {
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

module.exports = { getHolding, getHoldingRTPrice };
