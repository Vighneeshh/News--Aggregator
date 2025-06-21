const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// NewsAPI route
app.get('/news', async (req, res) => {
    try {
        const query = req.query.q || 'technology';
        const url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${process.env.NEWS_API_KEY}`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});

// OpenAI summarization route
app.post('/summarize', async (req, res) => {
    try {
        const { text } = req.body;

        const openaiResponse = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: "mistralai/mistral-7b-instruct",
                messages: [
                    {role: "system", content: "Summarize the following news article in 3-4 lines."},
                    {role: "user", content: text}
                ],
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const summary = openaiResponse.data.choices[0].message.content;
        res.json({ summary });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to summarize' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
 