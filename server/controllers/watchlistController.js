const knex = require('knex')(require('../knexfile'));
const dayjs = require('dayjs');

const getWatchlist = async (req, res) => {
    const userId = req.params.userId || req.user || '';

    try {
        const watchlist = await knex('watchlist')
            .join('symbol', { 'symbol.symbol': 'watchlist.ticker' })
            .select(
                'watchlist.id',
                'user_id',
                'ticker',
                'logo',
                'price',
                'prev_close',
                'currency',
                'updated_at'
            )
            .where({ user_id: userId });

        if (!watchlist) {
            return res
                .status(400)
                .json({ error: `User with id ${userId} not found` });
        } else {
            return res.status(200).json(watchlist);
        }
    } catch (error) {
        return res.status(400).json(`Error retrieving user ${userId} ${error}`);
    }
};

const addWatchItem = async (req, res) => {
    const userId = req.body.userId || req.user || '';
    const { ticker, name, exchange, sector, logo, price, prevClose, currency } =
        req.body;

    const addItemId = `${userId}-${ticker}`;

    const newWatchItem = {
        id: addItemId,
        user_id: userId,
        ticker,
    };

    const updateStockInfo = {
        name,
        exchange,
        sector,
        logo,
        price,
        prev_close: prevClose,
        currency,
        updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };

    try {
        await knex('symbol').update(updateStockInfo).where({ symbol: ticker });

        const watchlistItem = await knex('watchlist')
            .where({
                id: addItemId,
            })
            .first();

        if (watchlistItem) {
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
    const userId = req.body.userId || req.user || '';
    const ticker = req.body.ticker;
    const deleteItemId = `${userId}-${ticker}`;

    try {
        const watchlistItem = await knex('watchlist')
            .where({
                id: deleteItemId,
            })
            .first();

        if (!watchlistItem) {
            return res.status(400).json({ error: `Item does not exist` });
        } else {
            await knex('watchlist').where({ id: deleteItemId }).del();
            return res.status(200).json({
                message: `${ticker} has been deleted from ${userId} watchlist`,
            });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

module.exports = {
    getWatchlist,
    addWatchItem,
    deleteWatchItem,
};
