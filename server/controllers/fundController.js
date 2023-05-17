const knex = require('knex')(require('../knexfile'));
const { v1 } = require('uuid');

const getFundHistory = (req, res) => {
    knex('fund')
        .select('*')
        .where('user_id', req.params.userId)
        .orderBy('created_at', 'desc')
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

const changeFund = async (req, res) => {
    const { user_id: userId, type, currency, amount } = req.body;
    const validCurrency = ['usd', 'cad'];
    const validType = ['deposit', 'withdraw'];

    if (!validCurrency.includes(currency)) {
        return res.status(422).json({ error: 'Invalid fund currency' });
    }

    if (!validType.includes(type)) {
        return res.status(422).json({ error: 'Invalid funding type' });
    }

    if (isNaN(amount) || amount <= 0) {
        return res.status(422).json({ error: 'Invalid amount' });
    }

    try {
        const userData = await knex('user')
            .select('cash_cad', 'cash_usd')
            .where({ id: userId })
            .first();

        if (!userData) {
            return res.status(404).json({ error: 'User not found' });
        }

        let { cash_cad: cashCAD, cash_usd: cashUSD } = userData;

        if (type === 'withdraw') {
            if (currency === 'usd' && cashUSD >= amount) {
                cashUSD -= amount;
            } else if (currency === 'cad' && cashCAD >= amount) {
                cashCAD -= amount;
            } else {
                return res.status(422).json({ error: 'Insufficient funds' });
            }
        }

        if (type === 'deposit') {
            if (currency === 'usd') cashUSD += amount;
            if (currency === 'cad') cashCAD += amount;
        }

        await knex('user')
            .update({ cash_usd: cashUSD, cash_cad: cashCAD })
            .where({ id: userId });
        const newFund = { id: v1(), ...req.body };
        await knex('fund').insert(newFund);

        return res.status(200).json({ cash_usd: cashUSD, cash_cad: cashCAD });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

module.exports = { getFundHistory, changeFund };
