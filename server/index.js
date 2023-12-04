const express = require('express');
const rateLimit = require('express-rate-limit');
const { encode } = require('gpt-3-encoder');
const cors = require('cors');
const session = require('express-session');
// const MySQLStore = require('express-mysql-session')(session);
const helmet = require('helmet');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const { dockStart } = require('@nlpjs/basic');
require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');
const knex = require('knex')(require('./knexfile'));

const app = express();
const PORT = process.env.PORT || 8080;
const openai = new OpenAIApi(
    new Configuration({
        apiKey: process.env.OPENAI_KEY,
    })
);
const maxToken = 50;

const customKeyGenerator = (_req, _res) => {
    return 'global';
};

const apiLimiterMin = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: 'Please wait for a minute!',
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: customKeyGenerator,
});

const apiLimiterHr = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 60,
    message: 'Please wait for a hour!',
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: customKeyGenerator,
});

const apiLimiterDay = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 200,
    message: 'Please wait for a day!',
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: customKeyGenerator,
});

const userRoute = require('./routes/userRoute');
const tradeRoute = require('./routes/tradeRoute');
const holdingRoute = require('./routes/holdingRoute');
const fundRoute = require('./routes/fundRoute');
const priceRoute = require('./routes/priceRoute');
const watchlistRoute = require('./routes/watchlistRoute');
const portfolioRoute = require('./routes/portfolioRoute');
const symbolRoute = require('./routes/symbolRoute');
const statRoute = require('./routes/statRoute');
const authRoute = require('./routes/authRoute');

app.use(express.json());
app.use(helmet());
app.use(
    session({
        secret: process.env.JWT_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());
require('./passport-setup');

app.use(
    cors({
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    })
);

// passport.use(
//     new GoogleStrategy(
//         {
//             clientID: process.env.GOOGLE_CLIENT_ID,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//             callbackURL: process.env.GOOGLE_CALLBACK_URL,
//             scope: ['profile', 'email'],
//         },
//         (_accessToken, _refreshToken, profile, done) => {
//             const testProfile = 'evancheng';
//             knex('user')
//                 .select('id')
//                 .where('id', testProfile)
//                 .then(data => {
//                     if (data.length === 0) {
//                         console.log(
//                             `The user with user ${testProfile} is not found!`
//                         );
//                     } else {
//                         done(null, data[0]);
//                     }
//                 })
//                 .catch(err => {
//                     console.log(`Error retrieving user ${testProfile} ${err}`);
//                 });
//         }
//     )
// );

app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/trade', tradeRoute);
app.use('/holding', holdingRoute);
app.use('/fund', fundRoute);
app.use('/price', priceRoute);
app.use('/watchlist', watchlistRoute);
app.use('/portfolio', portfolioRoute);
app.use('/symbols', symbolRoute);
app.use('/stat', statRoute);

(async () => {
    const dockConfiguration = {
        settings: {
            nlp: { corpora: ['./corpora/corpus-en.json'] },
        },
        use: ['Basic', 'ConsoleConnector'],
    };
    const dock = await dockStart(dockConfiguration);
    const nlp = dock.get('nlp');
    await nlp.train();

    app.post(
        '/chatbot',
        apiLimiterMin,
        apiLimiterHr,
        apiLimiterDay,
        async (req, res) => {
            const text = req.body.text;
            const encoded = encode(text);
            if (encoded.length > 50) {
                return res.status(413).json('Input too large!');
            }
            const response = await nlp.process('en', text);
            if (response.intent !== 'None') {
                res.status(200).json({
                    intent: response.intent,
                    answer: response.answer,
                });
            } else {
                openai
                    .createChatCompletion({
                        model: 'gpt-3.5-turbo',
                        messages: [
                            {
                                role: 'system',
                                content: `Please answer the question in financial field in ${maxToken} tokens. If you cannot, just say I don't know. Otherwise, say No`,
                            },
                            {
                                role: 'user',
                                content: text,
                            },
                        ],
                        max_tokens: maxToken,
                    })
                    .then(response => {
                        const gptRes = response.data.choices[0].message.content;
                        res.status(200).json({
                            intent: 'gpt',
                            answer: gptRes,
                        });
                    });
            }
        }
    );
})();

app.get('/logout', (req, res) => {
    req.logout(error => {
        if (error) {
            return res.status(500).json({
                message: 'Server error, please try again later',
                error: error,
            });
        } else {
            console.log('logout success');
        }
        res.redirect(process.env.CLIENT_URL);
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
