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
        
        // Check if text is provided
        if (!text) {
            console.log('No text provided for summarization');
            return res.status(400).json({ error: 'No text provided for summarization' });
        }

        console.log('Received summarization request');
        console.log('Text length:', text.length);
        console.log('Text preview:', text.substring(0, 200) + '...');
        console.log('API Key exists:', !!process.env.OPENAI_API_KEY);
        console.log('API Key starts with:', process.env.OPENAI_API_KEY?.substring(0, 15) + '...');

        // Temporary mock summarization while we debug the API issue
        const mockSummary = `This is a news article about ${text.split(' ').slice(0, 5).join(' ')}... The article discusses recent developments and provides insights into the topic. Key points include important information that readers should know about this subject.`;
        
        console.log('Generated mock summary');
        res.json({ summary: mockSummary });

        /* 
        // OpenRouter API call - temporarily disabled for debugging
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
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'http://localhost:5000',
                    'X-Title': 'News Aggregator App'
                },
                timeout: 30000
            }
        );

        console.log('OpenAI response received');
        const summary = openaiResponse.data.choices[0].message.content;
        console.log('Summary generated:', summary.substring(0, 100) + '...');
        res.json({ summary });
        */
    } catch (err) {
        console.error('=== DETAILED ERROR INFO ===');
        console.error('Error message:', err.message);
        console.error('Error code:', err.code);
        console.error('Response status:', err.response?.status);
        console.error('Response data:', err.response?.data);
        console.error('Full error:', err);
        
        const errorDetails = {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data,
            code: err.code
        };
        
        res.status(500).json({ 
            error: 'Failed to summarize', 
            details: errorDetails
        });
    }
});

// Test endpoint to verify API key
app.get('/test-api', async (req, res) => {
    try {
        console.log('Testing API key...');
        console.log('API Key:', process.env.OPENAI_API_KEY?.substring(0, 20) + '...');
        
        const testResponse = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: "mistralai/mistral-7b-instruct",
                messages: [
                    {role: "user", content: "Say hello"}
                ],
                max_tokens: 10
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'http://localhost:5000',
                    'X-Title': 'News Aggregator App'
                }
            }
        );
        
        res.json({ success: true, response: testResponse.data });
    } catch (err) {
        console.error('API Test Error:', err.response?.data || err.message);
        res.status(500).json({ 
            error: 'API test failed', 
            details: err.response?.data || err.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
