const knex = require('knex')(require('../knexfile'));

const getPortfolio = async (req, res) => {
    const userId = req.params.userId;
    try {
        const portfolio = await knex('portfolio').where({ user_id: userId });
        if (!portfolio) return res.status(400).json({ error: `User with id ${userId} not found` });

        return res.status(200).json(portfolio)
    } catch (error) {
        return res.status(500).json({ error: `User with id ${userId} not found` });
    }
};


module.exports = { getPortfolio };
