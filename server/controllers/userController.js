const knex = require('knex')(require('../knexfile'));
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const singleUser = (req, res) => {
    let userId = '';
    if (req.params.username) {
        userId = req.params.username;
    } else if (req.user) {
        userId = req.user;
    }

    knex('user')
        .select(
            'id',
            'user_email',
            'first_name',
            'last_name',
            'cash_usd',
            'cash_cad',
            'dp'
        )
        .where('id', userId)
        .then(data => {
            if (data.length === 0) {
                return res
                    .status(404)
                    .json(
                        `The user with username ${userId} is not found!`
                    );
            } else {
                res.status(200).json(data[0]);
            }
        })
        .catch(err => {
            res.status(400).json(
                `Error retrieving user ${userId} ${err}`
            );
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

const checkUser = async (req, res) => {
    const { username, password } = req.body;
    if (username === '') {
        return res.status(404).json(`${username} is not found!`);
    }

    const validatedUsername = username.toLowerCase();

    try {
        const user = await knex('user')
            .select('id', 'password')
            .where('id', validatedUsername)
            .first();

        if (user) {
            const isCorrect = await argon2.verify(user.password, password);
            if (isCorrect) {
                const token = jwt.sign(
                    {
                        name: user.name,
                        username: username,
                        loginTime: Date.now(),
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: 10 }
                );
                return res.status(200).json(token);
            } else {
                return res.status(403).json('Invalid password');
            }
        } else {
            return res.status(404).json(`${username} is not found!`);
        }
    } catch (error) {
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

module.exports = { singleUser, addUser, checkUser };
