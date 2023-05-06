const express = require('express');
const app = express();
const cors = require('cors');

const userRoute = require('./routes/userRoute');
const tradeRoute = require('./routes/tradeRoute');
const holdingRoute = require('./routes/holdingRoute');
const fundRoute = require('./routes/fundRoute');
const priceRoute = require('./routes/priceRoute');

require('dotenv').config();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use('/user', userRoute);
app.use('/trade', tradeRoute);
app.use('/holding', holdingRoute);
app.use('/fund', fundRoute);
app.use('/price', priceRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
