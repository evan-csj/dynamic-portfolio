const watchlist = require('../seed_data/watchlist');

const knex = require('knex')(require('../knexfile'));

const getWatchlist = async (req, res) => {
    const userId = req.params.userId;
    const watchlist = await knex('watchlist')
        .select('id', 'user_id', 'ticker', 'price', 'currency')
        .where({ user_id: userId });

    if (!watchlist) return res.status(400).json({ error: `User with id ${userId} not found` });

    return res.status(200).json(watchlist);
};

const addWatchItem = async (req, res) => {
    const { user_id: userId, currency, price, ticker } = req.body;
    const newWatchItem = {
        id: `${userId}-${ticker}`,
        user_id: userId,
        ticker: ticker,
        price: price,
        currency: currency,
    };

    const watchlistItem = await knex('watchlist')
        .where({ user_id: userId })
        .andWhere({ ticker: ticker });

    if (watchlistItem.length !== 0) {
        return res.status(400).json({ error: `${ticker} already existed in ${userId} watchlist` });
    } else {
        await knex('watchlist').insert(newWatchItem);
        return res.status(200).json(newWatchItem);
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
        return res
            .status(200)
            .json({ message: `${ticker} has been deleted from ${userId} watchlist` });
    }
};

module.exports = { getWatchlist, addWatchItem, deleteWatchItem };
