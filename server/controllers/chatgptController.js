const { encode } = require('gpt-3-encoder');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();
const { OPENAI_KEY } = process.env;

const openai = new OpenAIApi(
    new Configuration({
        apiKey: OPENAI_KEY,
    })
);
const maxToken = 50;

const chatgpt = async (req, res) => {
    const text = req.body.text;
    const encoded = encode(text);
    if (encoded.length > 50) {
        return res.status(413).json('Input too large!');
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
            })
            .catch(error => {
                console.error('Error:', error);
                return res.status(500).json({ error: 'Something went wrong' });
            });
    }
};

module.exports = { chatgpt };
