const express = require('express');
const cors = require('cors');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
// const MySQLStore = require('express-mysql-session')(session);

const helmet = require('helmet');
const passport = require('passport');
const { createServer } = require('http');
const WebSocket = require('ws');
const dayjs = require('dayjs');

require('dotenv').config();
const mysql = require('mysql2');
const pg = require('pg');
const knexFile = require('./knexfile');

const app = express();
const server = createServer(app);
const wss = new WebSocket.Server({ server });
const redis = require('redis');

const {
    SECURE,
    REDIS_HOST,
    REDIS_PORT,
    REDIS_PASSWORD,
    CLIENT_URL,
    PORT,
    JWT_SECRET,
    FINNHUB_KEY,
    DB_PG_URL,
} = process.env;

const symbolData = require('./seed_data/symbols');

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

// const mysqlConnection = mysql.createConnection(knexFile.connection);
// const sessionStore = new MySQLStore({}, mysqlConnection);
const pgSessionStore = new pgSession({
    conObject: {
        connectionString: DB_PG_URL,
        ssl: true,
    },
    tableName: 'oauth',
});

app.use(express.json());
app.use(helmet());
app.use(
    session({
        secret: JWT_SECRET,
        resave: false,
        saveUninitialized: false,
        store: pgSessionStore,
        cookie: {
            secure: SECURE ? true : false,
            maxAge: 24 * 60 * 60 * 1000,
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());
require('./passport-setup');

app.use(
    cors({
        origin: CLIENT_URL,
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
        res.redirect(CLIENT_URL);
    });
});

const redisClient = redis.createClient({
    password: REDIS_PASSWORD,
    socket: {
        host: REDIS_HOST,
        port: REDIS_PORT,
    },
});

redisClient.on('error', err => console.log('Redis Client Error', err));
redisClient.connect();

let lastTime = 0;
let clientCount = 0;
let finnhubSocket;

const openSocket = () => {
    if (finnhubSocket) {
        console.log(
            'Finnhub Socket State (Check): %d / Client Count: %d',
            finnhubSocket.readyState,
            clientCount
        );
        if (finnhubSocket.readyState === WebSocket.OPEN) {
            return;
        }
    }

    finnhubSocket = new WebSocket(`wss://ws.finnhub.io?token=${FINNHUB_KEY}`);
    finnhubSocket.on('open', () => {
        console.log(
            'Finnhub Socket State (Open): %d / Client Count: %d',
            finnhubSocket.readyState,
            clientCount
        );
        symbolData.forEach(element => {
            finnhubSocket.send(
                JSON.stringify({
                    type: 'subscribe',
                    symbol: element.symbol,
                })
            );
        });
    });
    finnhubSocket.on('message', async data => {
        const currentTime = dayjs().unix();
        if (currentTime - lastTime >= 1) {
            try {
                const message = JSON.parse(data);
                if (message.type === 'trade') {
                    const firstMessage = message.data[0];
                    await redisClient.set(firstMessage.s, firstMessage.p);
                    lastTime = currentTime;
                }
                // console.log(message);
            } catch (error) {
                console.error(error);
            }
        }
    });
    finnhubSocket.on('close', () => {
        console.log(
            'Finnhub Socket State (Close): %d / Client Count: %d',
            finnhubSocket.readyState,
            clientCount
        );
    });
    finnhubSocket.on('error', console.error);
};

const closeSocket = () => {
    if (finnhubSocket) {
        if (finnhubSocket.readyState === WebSocket.OPEN) {
            finnhubSocket.close();
        }
    }
};

const clientSubscriptions = new Map();
const sendInterval = (ws, symbol) => {
    const symbolInterval = setInterval(async () => {
        const price = await redisClient.get(symbol);
        if (price) {
            const jsonObj = {
                symbol,
                price,
            };
            ws.send(JSON.stringify(jsonObj));
        }
    }, 1000);

    const clientSubs = clientSubscriptions.get(ws) || new Set();
    clientSubs.add({ symbol, symbolInterval });
    clientSubscriptions.set(ws, clientSubs);
};
const stopInterval = (ws, symbol) => {
    const clientSubs = clientSubscriptions.get(ws);
    if (clientSubs) {
        const deleteSubs = [...clientSubs].find(sub => sub.symbol === symbol);
        if (deleteSubs) {
            clearInterval(deleteSubs.symbolInterval);
            clientSubs.delete(deleteSubs);
        }
    }
};

wss.on('connection', ws => {
    console.log('A user connected');
    clientCount++;
    openSocket();
    ws.on('message', async message => {
        const receivedData = JSON.parse(message);
        const type = receivedData.type;
        const symbol = receivedData.symbol;

        if (type === 'subscribe') {
            sendInterval(ws, symbol);
        } else if (type === 'unsubscribe') {
            stopInterval(ws, symbol);
        }
    });
    ws.on('close', () => {
        console.log('A user disconnected');
        clientCount--;
        if (clientCount === 0) closeSocket();
        const clientSubs = clientSubscriptions.get(ws);
        if (clientSubs) {
            clientSubs.forEach(subs => {
                clearInterval(subs.symbolInterval);
            });
            clientSubscriptions.delete(ws);
        }
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
