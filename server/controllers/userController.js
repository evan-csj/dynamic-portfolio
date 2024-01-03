const knex = require('knex')(require('../knexfile'));
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { JWT_SECRET } = process.env;

const singleUser = async (req, res) => {
    const userId = req.params.userId || req.user || '';

    try {
        const user = await knex('user')
            .select(
                'id',
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
                    JWT_SECRET,
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

const editUser = async (req, res) => {
    const { oldUserId, newUserId, firstName, lastName } = req.body;
    const validatedUserId = newUserId.toLowerCase();

    const updateUserData = {
        id: validatedUserId,
        first_name: firstName,
        last_name: lastName,
        is_new: false,
    };

    try {
        let user = undefined;
        if (oldUserId !== validatedUserId) {
            user = await knex('user').where({ id: newUserId }).first();
        }

        if (!user) {
            const updatedUser = await knex('user')
                .where({ id: oldUserId })
                .update(updateUserData);
            return res.status(200).json(updatedUser);
        } else {
            return res.status(403).json({ error: 'User Exist!' });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

module.exports = { singleUser, checkUser, editUser };
