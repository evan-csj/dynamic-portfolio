const knex = require('knex')(require('../knexfile'));
const { v1 } = require('uuid');

const getFundHistory = async (req, res) => {
    const userId = req.params.userId || req.user || '';

    try {
        const fundHistory = await knex('fund')
            .select('*')
            .where('user_id', userId)
            .orderBy('created_at', 'desc');
        if (!fundHistory) {
            return res
                .status(404)
                .json(`The holding with user id ${userId} is not found!`);
        } else {
            return res.status(200).json(fundHistory);
        }
    } catch (error) {
        res.status(400).json(`Error retrieving user id ${userId} ${error}`);
    }
};

const changeFund = async (req, res) => {
    const { type, currency, amount } = req.body;
    const userId = req.body.userId ? req.body.userId : req.user || '';
    const newFunding = {
        user_id: userId,
        type,
        amount,
        currency,
    };
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
        const newFundingHistory = { id: v1(), ...newFunding };
        await knex('fund').insert(newFundingHistory);

        return res.status(200).json({ cash_usd: cashUSD, cash_cad: cashCAD });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

module.exports = { getFundHistory, changeFund };
