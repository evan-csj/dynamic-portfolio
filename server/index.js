const express = require('express');
const app = express();
const cors = require('cors');
const { dockStart } = require('@nlpjs/basic');
require('dotenv').config();
const PORT = process.env.PORT || 8080;
const { Configuration, OpenAIApi } = require('openai');
const openai = new OpenAIApi(
    new Configuration({
        apiKey: process.env.OPENAI_KEY,
    })
);

const userRoute = require('./routes/userRoute');
const tradeRoute = require('./routes/tradeRoute');
const holdingRoute = require('./routes/holdingRoute');
const fundRoute = require('./routes/fundRoute');
const priceRoute = require('./routes/priceRoute');
const watchlistRoute = require('./routes/watchlistRoute');
const portfolioRoute = require('./routes/portfolioRoute');
const symbolRoute = require('./routes/symbolRoute');
const statRoute = require('./routes/statRoute');

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

    app.post('/chatbot', async (req, res) => {
        const text = req.body.text;
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
                    messages: [{ role: 'user', content: text + ' in financial field in 50 words' }],
                })
                .then(response => {
                    const gptRes = response.data.choices[0].message.content;
                    res.status(200).json({
                        intent: 'gpt',
                        answer: gptRes,
                    });
                });
        }
    });
})();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
