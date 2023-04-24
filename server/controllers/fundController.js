const knex = require('knex')(require('../knexfile'));
const { v4: uuid } = require('uuid');
const validation = require('./validation');

const getFundHistory = (req, res) => {
    knex('fund')
        .select('id', 'user_id', 'amount', 'type', 'currency')
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
        const newFund = { id: uuid(), ...req.body };
        await knex('fund').insert(newFund);

        return res.status(200).json({ cash_usd: cashUSD, cash_cad: cashCAD });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong' });
    }

    // knex('user')
    //     .select('cash_cad', 'cash_usd')
    //     .where({ id: fundDetail.user_id })
    //     .then(data => {
    //         if (data.length === 0) {
    //             return res
    //                 .status(404)
    //                 .json(
    //                     `The holding with user id ${fundDetail.user_id} is not found!`
    //                 );
    //         } else {
    //             cashCAD = data[0].cash_cad;
    //             cashUSD = data[0].cash_usd;
    //             const { type, currency, amount } = fundDetail;

    //             if (type === 'withdraw') {
    //                 if (currency === 'usd' && cashUSD >= amount) {
    //                     cashUSD -= amount;
    //                 } else if (currency === 'cad' && cashUSD >= amount) {
    //                     cashCAD -= amount;
    //                 } else {
    //                     return res.json(
    //                         `To withdraw ${amount} ${currency} cash is not enough`
    //                     );
    //                 }
    //             }

    //             if (type === 'deposit') {
    //                 if (currency === 'usd') cashUSD += amount;
    //                 if (currency === 'cad') cashCAD += amount;
    //             }

    //             knex('user')
    //                 .update({ cash_usd: cashUSD, cash_cad: cashCAD })
    //                 .where({ id: fundDetail.user_id })
    //                 .then(data => {
    //                     console.log({
    //                         cash_usd: cashUSD,
    //                         cash_cad: cashCAD,
    //                     });
    //                 });
    //         }
    //     });

    // const newFund = { id: uuid(), ...fundDetail };

    // knex('fund')
    //     .insert(newFund)
    //     .then(data => {
    //         console.log({
    //             cash_usd: cashUSD,
    //             cash_cad: cashCAD,
    //         });
    //     });

    // if (cashCAD < 0 || cashUSD < 0) {
    //     return res.json('Something wrong with funding');
    // } else {
    //     return res.status(200).json({
    //         cash_usd: cashUSD,
    //         cash_cad: cashCAD,
    //     });
    // }
};

module.exports = { getFundHistory, changeFund };
