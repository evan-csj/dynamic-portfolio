const knex = require('knex')(require('../knexfile'));

const getSymbol = async (req, res) => {
    const symbols = await knex('symbol');
    return res.status(200).json(symbols);
};

module.exports = { getSymbol };
