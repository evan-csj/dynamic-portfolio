const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const knex = require('knex')(require('./knexfile'));
const { v1 } = require('uuid');
require('dotenv').config();
const {
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    GITHUB_CALLBACK_URL,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL,
} = process.env;

passport.use(
    new GitHubStrategy(
        {
            clientID: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            callbackURL: GITHUB_CALLBACK_URL,
            scope: ['profile', 'email'],
        },
        (_accessToken, _refreshToken, profile, done) => {
            return done(null, profile);
        }
    )
);

passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: GOOGLE_CALLBACK_URL,
            scope: ['profile', 'email'],
        },
        (_accessToken, _refreshToken, profile, done) => {
            return done(null, profile);
        }
    )
);

passport.serializeUser(async (userOAuth, done) => {
    const { provider } = userOAuth;
    try {
        let keyField, keyValue, defaultId;

        if (provider) {
            switch (provider) {
                case 'github':
                    keyField = 'github_username';
                    keyValue = userOAuth.username;
                    defaultId = keyValue + '@github';
                    firstName = userOAuth.displayName;
                    lastName = '';
                    break;
                case 'google':
                    keyField = 'user_gmail';
                    keyValue = userOAuth.emails[0].value;
                    defaultId = keyValue.split('@')[0] + '@google';
                    firstName = userOAuth.name.givenName;
                    lastName = userOAuth.name.familyName;
                    break;
                default:
                    done(new Error('Undefined Authentication!'));
                    return;
            }

            const userDB = await knex('user')
                .select('id', keyField)
                .where(keyField, keyValue)
                .first();

            if (!userDB) {
                const idLowerCase = defaultId.toLowerCase();
                const newUser = {
                    id: idLowerCase,
                    [keyField]: keyValue,
                    first_name: firstName,
                    last_name: lastName,
                    cash_usd: 10000,
                    cash_cad: 100,
                };

                const watchlistForNewUser = [
                    {
                        id: v1(),
                        user_id: idLowerCase,
                        ticker: 'AAPL',
                    },
                    {
                        id: v1(),
                        user_id: idLowerCase,
                        ticker: 'NVDA',
                    },
                    {
                        id: v1(),
                        user_id: idLowerCase,
                        ticker: 'TSLA',
                    },
                ];

                await knex('user').insert(newUser);
                await knex('watchlist').insert(watchlistForNewUser);
            }

            done(null, userOAuth);
        } else {
            done(new Error('Undefined Authentication!'));
        }
    } catch (error) {
        done(error);
    }
});

passport.deserializeUser(async (sessionObj, done) => {
    const provider = sessionObj.provider;
    try {
        let userDB = undefined;
        if (provider === 'github') {
            const githubUsername = sessionObj.username;
            userDB = await knex('user')
                .select('id', 'github_username')
                .where({ github_username: githubUsername })
                .first();
            if (userDB) {
                done(null, userDB.id);
            } else {
                done(null, false);
            }
        } else if (provider === 'google') {
            const gmail = sessionObj.emails[0].value;
            userDB = await knex('user')
                .select('id', 'user_gmail')
                .where({ user_gmail: gmail })
                .first();
            if (userDB) {
                done(null, userDB.id);
            } else {
                done(null, false);
            }
        } else {
            done(new Error('Undefined Authentication!'));
        }
    } catch (error) {
        done(error);
    }
});
