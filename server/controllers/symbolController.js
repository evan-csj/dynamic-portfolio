const knex = require('knex')(require('../knexfile'));

const getSymbol = async (req, res) => {
    const symbols = await knex('symbol')
        .limit(10)
        .where('symbol', 'like', `%${req.params.symbol}%`);
    return res.status(200).json(symbols);
};

module.exports = { getSymbol };
