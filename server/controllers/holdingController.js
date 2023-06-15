const knex = require('knex')(require('../knexfile'));

const selectHolding = userId =>
    knex('holding')
        .join('symbol', { 'symbol.symbol': 'holding.ticker' })
        .select(
            'id',
            'user_id',
            'ticker',
            'avg_price',
            'price',
            'buy_shares',
            'sell_shares',
            'currency',
            'updated_at'
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

module.exports = { getHolding };
