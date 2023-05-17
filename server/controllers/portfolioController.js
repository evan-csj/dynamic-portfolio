const knex = require('knex')(require('../knexfile'));

const updatePortfolio = async (req, res) => {
    const userId = req.params.userId;
    const dp = req.body;
    try {
        const user = await knex('user').where({ id: userId });
        if (!user) return res.status(400).json({ error: `User with id ${userId} not found` });
        await knex('user')
            .where({ id: userId })
            .update({ dp: JSON.stringify(dp) });
        return res.status(200).json(dp);
    } catch (error) {
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

module.exports = { updatePortfolio };
