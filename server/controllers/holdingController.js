const knex = require('knex')(require('../knexfile'));

const getHolding = (req, res) => {
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
        .where('user_id', req.params.userId)
        .then(data => {
            if (data.length === 0) {
                return res
                    .status(404)
                    .json(
                        `The holding with user id ${req.params.userId} is not found!`
                    );
            } else {
                res.status(200).json(data);
            }
        })
        .catch(err => {
            res.status(400).json(
                `Error retrieving user id ${req.params.userId} ${err}`
            );
        });
};

module.exports = { getHolding };
