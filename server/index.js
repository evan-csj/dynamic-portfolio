const express = require('express');
const cors = require('cors');
const session = require('express-session');
// const MySQLStore = require('express-mysql-session')(session);
const helmet = require('helmet');
const passport = require('passport');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

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
const chatgptRoute = require('./routes/chatgptRoute');

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

app.use('/user', userRoute);
app.use('/trade', tradeRoute);
app.use('/holding', holdingRoute);
app.use('/fund', fundRoute);
app.use('/price', priceRoute);
app.use('/watchlist', watchlistRoute);
app.use('/portfolio', portfolioRoute);
app.use('/symbols', symbolRoute);
app.use('/stat', statRoute);
app.use('/auth', authRoute);
app.use('/chatgpt', chatgptRoute);

app.get('/logout', (req, res) => {
    req.logout(error => {
        if (error) {
            console.error('Error:', error);
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
