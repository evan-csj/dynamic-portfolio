const getRTPrice = (req, res) => {
    const type = req.query.type;
    const WebSocket = require('ws');
    const ws = new WebSocket(
        'wss://ws.finnhub.io?token=chcq92hr01qm1ei3tmi0chcq92hr01qm1ei3tmig'
    );
    ws.on('error', console.error);

    ws.on('open', function open() {
        ws.send(JSON.stringify({ type: 'subscribe', symbol: 'BINANCE:BTCUSDT' }));
    });

    ws.on('message', function message(data) {
        console.log('received: %s', data);
    });

    return res.status(200).json({ message: `websocket ${type}` });
};

module.exports = { getRTPrice };
