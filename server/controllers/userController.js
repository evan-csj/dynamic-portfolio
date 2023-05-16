const knex = require('knex')(require('../knexfile'));

const singleUser = (req, res) => {
    knex('user')
        .select('id', 'user_email', 'first_name', 'last_name', 'cash_usd', 'cash_cad', 'dp')
        .where('id', req.params.username)
        .then(data => {
            if (data.length === 0) {
                return res
                    .status(404)
                    .json(`The user with username ${req.params.username} is not found!`);
            } else {
                res.status(200).json(data[0]);
            }
        })
        .catch(err => {
            res.status(400).json(`Error retrieving user ${req.params.username} ${err}`);
        });
};

const addUser = (req, res) => {
    const newUser = req.body;
    knex('user')
        .insert(newUser)
        .then(_data => {
            res.status(201).json(newUser);
        })
        .catch(err => {
            res.status(400).json(`Error creating user: ${err}`);
        });
};

module.exports = { singleUser, addUser };
