const express = require('express');
const app = express();
const cors = require('cors');
// const WebSocket = require('ws');

const userRoute = require('./routes/userRoute');
const tradeRoute = require('./routes/tradeRoute');
const holdingRoute = require('./routes/holdingRoute');
const fundRoute = require('./routes/fundRoute');
const priceRoute = require('./routes/priceRoute');
const watchlistRoute = require('./routes/watchlistRoute');
const portfolioRoute = require('./routes/portfolioRoute');
const symbolRoute = require('./routes/symbolRoute');
const websocketRoute = require('./routes/websocketRoute');

// const ws = new WebSocket(
//     'wss://ws.finnhub.io?token=chcq92hr01qm1ei3tmi0chcq92hr01qm1ei3tmig'
// );

require('dotenv').config();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use('/user', userRoute);
app.use('/trade', tradeRoute);
app.use('/holding', holdingRoute);
app.use('/fund', fundRoute);
app.use('/price', priceRoute);
app.use('/watchlist', watchlistRoute);
app.use('/portfolio', portfolioRoute);
app.use('/symbols', symbolRoute);
app.use('/websocket', websocketRoute);

// ws.on('error', console.error);

// ws.on('open', function open() {
//     ws.send(JSON.stringify({ type: 'subscribe', symbol: 'BINANCE:BTCUSDT' }));
// });

// ws.on('message', function message(data) {
//     console.log('received: %s', data);
// });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
