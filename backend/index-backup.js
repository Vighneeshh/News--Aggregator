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

// Headlines route
app.get('/headlines', async (req, res) => {
    try {
        const country = req.query.country || 'us';
        const url = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${process.env.NEWS_API_KEY}`;
        console.log('Fetching headlines from:', url.replace(process.env.NEWS_API_KEY, 'API_KEY_HIDDEN'));
        const response = await axios.get(url);
        console.log('Headlines fetched successfully:', response.data.articles?.length, 'articles');
        res.json(response.data);
    } catch (err) {
        console.error('Error fetching headlines:', err.message);
        console.log('Returning mock headlines data');
        
        // Return mock data if API fails
        const mockHeadlines = {
            status: "ok",
            totalResults: 3,
            articles: [
                {
                    source: { id: "cnn", name: "CNN" },
                    author: "CNN Staff",
                    title: "Breaking: Major Technology Breakthrough Announced",
                    description: "Scientists have made a significant breakthrough in quantum computing technology that could revolutionize the industry.",
                    url: "https://example.com/tech-breakthrough",
                    urlToImage: "https://via.placeholder.com/400x200/0066cc/ffffff?text=Tech+News",
                    publishedAt: new Date().toISOString(),
                    content: "Scientists have made a significant breakthrough in quantum computing..."
                },
                {
                    source: { id: "bbc", name: "BBC News" },
                    author: "BBC Reporter",
                    title: "Global Climate Summit Reaches Historic Agreement",
                    description: "World leaders have reached a consensus on new climate policies aimed at reducing carbon emissions by 50% over the next decade.",
                    url: "https://example.com/climate-summit",
                    urlToImage: "https://via.placeholder.com/400x200/009900/ffffff?text=Climate+News",
                    publishedAt: new Date(Date.now() - 3600000).toISOString(),
                    content: "World leaders have reached a consensus on new climate policies..."
                },
                {
                    source: { id: "reuters", name: "Reuters" },
                    author: "Reuters Team",
                    title: "Stock Markets Hit Record Highs Amid Economic Recovery",
                    description: "Major stock indices around the world have reached new record highs as economic indicators show strong recovery trends.",
                    url: "https://example.com/stock-markets",
                    urlToImage: "https://via.placeholder.com/400x200/cc6600/ffffff?text=Finance+News",
                    publishedAt: new Date(Date.now() - 7200000).toISOString(),
                    content: "Major stock indices around the world have reached new record highs..."
                }
            ]
        };
        
        res.json(mockHeadlines);
    }
});

// Enhanced AI summarization endpoint
app.post('/summarize', async (req, res) => {
    try {
        const { title, description, content, url, source, publishedAt } = req.body;
        
        if (!title && !description && !content) {
            return res.status(400).json({ error: 'No content provided to summarize' });
        }

        // Create comprehensive text from available content
        let textToSummarize = '';
        if (title) textToSummarize += `Title: ${title}\n\n`;
        if (description) textToSummarize += `Description: ${description}\n\n`;
        if (content) textToSummarize += `Content: ${content}`;
        
        console.log('Summarizing article:', title?.substring(0, 50) + '...');
        console.log('Text length:', textToSummarize.length);

        // Mock enhanced AI response for development
        const mockSummary = {
            summary: `This article discusses ${title?.toLowerCase().includes('technology') ? 'technological developments' : 
                title?.toLowerCase().includes('politics') ? 'political developments' : 
                title?.toLowerCase().includes('health') ? 'health-related news' :
                title?.toLowerCase().includes('business') ? 'business and economic news' :
                'recent news developments'}. The key information covers important aspects that readers should be aware of, providing insights into the current situation and its potential implications for the future.`,
            
            keyPoints: [
                title?.toLowerCase().includes('technology') ? 'Advances in digital innovation and tech industry developments' :
                title?.toLowerCase().includes('politics') ? 'Political landscape changes and policy implications' :
                title?.toLowerCase().includes('health') ? 'Health sector updates and medical breakthroughs' :
                title?.toLowerCase().includes('business') ? 'Market trends and economic indicators' :
                'Significant developments in the news topic',
                
                'Impact on stakeholders and affected communities',
                'Future outlook and potential consequences',
                'Expert opinions and analysis of the situation'
            ],
            
            sentiment: description?.toLowerCase().includes('positive') || description?.toLowerCase().includes('growth') || 
                      description?.toLowerCase().includes('success') ? 'positive' :
                      description?.toLowerCase().includes('concern') || description?.toLowerCase().includes('crisis') ||
                      description?.toLowerCase().includes('problem') ? 'negative' : 'neutral',
            
            confidence: 0.85,
            title,
            source: source?.name || source,
            publishedAt,
            url
        };

        /*
        // Real OpenAI implementation (uncomment when API key is available)
        const openaiResponse = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-4",
                messages: [
                    {
                        role: "system", 
                        content: `You are an expert news analyst. Provide a comprehensive analysis of the given news article in JSON format with the following structure:
                        {
                            "summary": "A concise but informative 2-3 sentence summary",
                            "keyPoints": ["array", "of", "3-4", "key points"],
                            "sentiment": "positive/negative/neutral",
                            "confidence": 0.0-1.0
                        }`
                    },
                    {role: "user", content: textToSummarize}
                ],
                max_tokens: 500,
                temperature: 0.3
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );

        const aiAnalysis = JSON.parse(openaiResponse.data.choices[0].message.content);
        const enhancedResponse = {
            ...aiAnalysis,
            title,
            source: source?.name || source,
            publishedAt,
            url
        };

        res.json(enhancedResponse);
        */

        // Return mock response for now
        setTimeout(() => {
            res.json(mockSummary);
        }, 1500); // Simulate API delay
        
    } catch (err) {
        console.error('Summarization error:', err.message);
        res.status(500).json({ 
            error: 'Failed to generate AI summary',
            message: 'The AI summarization service is currently unavailable. Please try again later.'
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
