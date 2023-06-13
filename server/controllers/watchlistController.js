const knex = require('knex')(require('../knexfile'));
const priceController = require('./priceController');

const getWatchlist = async (req, res) => {
    const userId = req.params.userId;
    const watchlist = await knex('watchlist')
        .join('symbol', { 'symbol.symbol': 'watchlist.ticker' })
        .select(
            'watchlist.id',
            'user_id',
            'ticker',
            'logo',
            'price',
            'prev_close',
            'currency'
        )
        .where({ user_id: userId });

    if (!watchlist)
        return res
            .status(400)
            .json({ error: `User with id ${userId} not found` });

    return res.status(200).json(watchlist);
};

const addWatchItem = async (req, res) => {
    const {
        id,
        user_id: userId,
        ticker,
        name,
        exchange,
        sector,
        logo,
        price,
        prev_close,
        currency,
    } = req.body;

    const newWatchItem = {
        id: id,
        user_id: userId,
        ticker: ticker,
    };

    const updateStockInfo = {
        name: name,
        exchange: exchange,
        sector: sector,
        logo: logo,
        price: price,
        prev_close: prev_close,
        currency: currency,
    };

    try {
        await knex('symbol').update(updateStockInfo).where({ symbol: ticker });

        const watchlistItem = await knex('watchlist').where({ id: id });

        if (watchlistItem.length !== 0) {
            return res.status(400).json({
                error: `${ticker} already existed in ${userId} watchlist`,
            });
        } else {
            await knex('watchlist').insert(newWatchItem);
            return res.status(200).json(newWatchItem);
        }
    } catch (error) {
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

const deleteWatchItem = async (req, res) => {
    const itemId = req.params.id;
    const watchlistItem = await knex('watchlist').where({ id: itemId });

    if (watchlistItem.length === 0) {
        return res.status(400).json({ error: `Item does not exist` });
    } else {
        const { user_id: userId, ticker } = watchlistItem[0];
        await knex('watchlist').where({ id: itemId }).del();
        return res.status(200).json({
            message: `${ticker} has been deleted from ${userId} watchlist`,
        });
    }
};

module.exports = {
    getWatchlist,
    addWatchItem,
    deleteWatchItem,
};
