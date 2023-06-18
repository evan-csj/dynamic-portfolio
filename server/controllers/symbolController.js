const knex = require('knex')(require('../knexfile'));
const dayjs = require('dayjs');

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

    const updateInfo = {
        name: name,
        exchange: exchange,
        sector: sector,
        logo: logo,
        currency: currency,
    };

    await knex('symbol').where({ symbol: ticker }).update(updateInfo);
    return res.status(200).json(updateInfo);
};

const updateSymbolPrice = async (req, res) => {
    const { symbol, price, prevClose } = req.body;
    const updatePrice = {
        price: price,
        prev_close: prevClose,
        updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };
    await knex('symbol').where({ symbol: symbol }).update(updatePrice);
    return res.status(200).json(updatePrice);
};

module.exports = { getSymbols, updateSymbolInfo, updateSymbolPrice };
