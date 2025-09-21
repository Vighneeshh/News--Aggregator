const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

// NewsAPI route
app.get('/news', async (req, res) => {
    try {
        const query = req.query.q || 'technology';
        const url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${process.env.NEWS_API_KEY}`;
        console.log('Fetching news...');
        const response = await axios.get(url);
        console.log('News fetched successfully:', response.data.articles?.length, 'articles');
        res.json(response.data);
    } catch (err) {
        console.error('Error fetching news:', err.message);
        // Return mock news data if API fails
        const mockNews = {
            status: "ok",
            totalResults: 2,
            articles: [
                {
                    source: { id: "techcrunch", name: "TechCrunch" },
                    author: "Tech Reporter",
                    title: "Revolutionary AI Technology Transforms Industry",
                    description: "New artificial intelligence technology is making waves across multiple industries with unprecedented capabilities.",
                    url: "https://example.com/ai-technology",
                    urlToImage: "https://via.placeholder.com/400x200/0066ff/ffffff?text=AI+Tech",
                    publishedAt: new Date().toISOString(),
                    content: "Revolutionary AI technology is transforming industries..."
                },
                {
                    source: { id: "wired", name: "Wired" },
                    author: "Science Writer",
                    title: "Breakthrough in Quantum Computing Research",
                    description: "Scientists achieve new milestone in quantum computing that could change everything we know about processing power.",
                    url: "https://example.com/quantum-breakthrough",
                    urlToImage: "https://via.placeholder.com/400x200/ff6600/ffffff?text=Quantum+News",
                    publishedAt: new Date(Date.now() - 1800000).toISOString(),
                    content: "Scientists achieve new milestone in quantum computing..."
                }
            ]
        };
        res.json(mockNews);
    }
});

// Headlines route
app.get('/headlines', async (req, res) => {
    try {
        const country = req.query.country || 'us';
        const url = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${process.env.NEWS_API_KEY}`;
        console.log('Fetching headlines...');
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

// AI summarization endpoint
app.post('/summarize', async (req, res) => {
    try {
        const { title, description, content, url, source, publishedAt } = req.body;
        
        if (!title && !description && !content) {
            return res.status(400).json({ error: 'No content provided to summarize' });
        }

        console.log('Summarizing article:', title?.substring(0, 50) + '...');

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

        // Simulate API delay
        setTimeout(() => {
            res.json(mockSummary);
        }, 1500);
        
    } catch (err) {
        console.error('Summarization error:', err.message);
        res.status(500).json({ 
            error: 'Failed to generate AI summary',
            message: 'The AI summarization service is currently unavailable. Please try again later.'
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`News endpoint: http://localhost:${PORT}/news`);
    console.log(`Headlines endpoint: http://localhost:${PORT}/headlines`);
    console.log(`Summarize endpoint: http://localhost:${PORT}/summarize`);
});