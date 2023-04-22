const { v4: uuid } = require('uuid');
const knex = require('knex')(require('../knexfile'));
const dayjs = require('dayjs');

const tradeHistory = (req, res) => {
    knex('trade')
        .select('*')
        .where('user_id', req.params.userid)
        .then(data => {
            if (data.length === 0) {
                console.log(data)
                return res
                    .status(404)
                    .json(
                        `The trade history with user id ${req.params.userid} is not found!`
                    );
            } else {
                res.status(200).json(data);
            }
        })
        .catch(err => {
            res.status(400).json(
                `Error retrieving user ${req.params.username} ${err}`
            );
        });
};

module.exports = { tradeHistory };
