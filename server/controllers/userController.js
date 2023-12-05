const knex = require('knex')(require('../knexfile'));
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const singleUser = async (req, res) => {
    const userId = req.params.userId || req.user || '';

    try {
        const user = await knex('user')
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
            .first();

        if (!user) {
            return res
                .status(404)
                .json(`The user with username ${userId} is not found!`);
        } else {
            return res.status(200).json(user);
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(400).json(`Error retrieving user ${userId} ${error}`);
    }
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
                    { expiresIn: '1d' }
                );
                return res.status(200).json(token);
            } else {
                return res.status(403).json('Invalid password');
            }
        } else {
            return res.status(404).json(`${username} is not found!`);
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

module.exports = { singleUser, addUser, checkUser };
