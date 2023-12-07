const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const knex = require('knex')(require('./knexfile'));

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL,
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
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
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
        let userDB;
        let keyField, keyValue, defaultId;

        if (provider) {
            switch (provider) {
                case 'github':
                    keyField = 'github_username';
                    keyValue = userOAuth.username;
                    defaultId = keyValue;
                    firstName = 'GitHub';
                    lastName = 'User';
                    break;
                case 'google':
                    keyField = 'user_gmail';
                    keyValue = userOAuth.emails[0].value;
                    defaultId = keyValue.split('@')[0];
                    firstName = userOAuth.name.givenName;
                    lastName = userOAuth.name.familyName;
                    break;
                default:
                    done(new Error('Undefined Authentication!'));
                    return;
            }

            userDB = await knex('user')
                .select('id', keyField)
                .where(keyField, keyValue)
                .first();

            if (!userDB) {
                const newUser = {
                    id: defaultId,
                    [keyField]: keyValue,
                    password: '',
                    first_name: firstName,
                    last_name: lastName,
                    cash_usd: 10000,
                    cash_cad: 100,
                    dp: {},
                };

                await knex('user').insert(newUser);
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
                .where('github_username', githubUsername)
                .first();
            if (userDB) {
                done(null, userDB.id);
            } else {
                done(
                    new Error(
                        `User with github id ${githubUsername} is not found!`
                    )
                );
            }
        } else if (provider === 'google') {
            const gmail = sessionObj.emails[0].value;
            userDB = await knex('user')
                .select('id', 'user_gmail')
                .where('user_gmail', gmail)
                .first();
            if (userDB) {
                done(null, userDB.id);
            } else {
                done(new Error(`User with gmail ${gmail} is not found!`));
            }
        } else {
            done(new Error('Undefined Authentication!'));
        }
    } catch (error) {
        done(error);
    }
});
