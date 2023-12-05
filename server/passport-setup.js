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

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser(async (sessionObj, done) => {
    const githubUsername = sessionObj.username;
    try {
        const user = await knex('user')
            .select('id', 'github_username')
            .where('github_username', githubUsername)
            .first();
        if (user) {
            done(null, user.id);
        } else {
            done(new Error(`${githubUsername} is not found!`));
        }
    } catch (error) {
        done(error);
    }
});
