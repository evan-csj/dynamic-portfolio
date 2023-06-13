const knex = require('knex')(require('../knexfile'));

const getSymbols = async (req, res) => {
    if (Object.keys(req.query).length === 0) {
        const symbols = await knex('symbol');
        return res.status(200).json(symbols);
    } else {
        const symbol = await knex('symbol').where({
            symbol: req.query.symbol,
        });
        return res.status(200).json(symbol);
    }
};

const updateSymbolInfo = async (req, res) => {
    const { ticker, name, exchange, sector, logo, currency } = req.body;

    const updateStockInfo = {
        name: name,
        exchange: exchange,
        sector: sector,
        logo: logo,
        currency: currency,
    };

    await knex('symbol').where({ symbol: ticker }).update(updateStockInfo);
    return res.status(200).json(updateStockInfo);
};

module.exports = { getSymbols, updateSymbolInfo };
