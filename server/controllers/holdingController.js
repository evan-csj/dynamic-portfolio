const knex = require('knex')(require('../knexfile'));

const getHolding = async (req, res) => {
    const userId = req.params.userId || req.user || '';

    try {
        const holding = await knex('holding')
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
        if (!holding) {
            return res
                .status(404)
                .json(`The holding with user id ${userId} is not found!`);
        } else {
            return res.status(200).json(holding);
        }
    } catch (error) {
        console.error(error);
        return res
            .status(400)
            .json(`Error retrieving user id ${userId} ${error}`);
    }
};

module.exports = { getHolding };
