const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'News Aggregator Backend is running' });
});

// Top headlines endpoint
app.get('/headlines', async (req, res) => {
    try {
        console.log('📰 Fetching top headlines from News API...');
        const country = req.query.country || 'us';
        const category = req.query.category || '';
        const pageSize = req.query.pageSize || 20;
        
        let url = `https://newsapi.org/v2/top-headlines?country=${country}&pageSize=${pageSize}&apiKey=${process.env.NEWS_API_KEY}`;
        if (category) {
            url += `&category=${category}`;
        }
        
        const response = await axios.get(url);
        console.log(`✅ Headlines received: ${response.data.articles?.length} articles`);
        res.json(response.data);
    } catch (error) {
        console.error('❌ Error fetching headlines:', error.response?.data || error.message);
        
        // Fallback to mock data
        console.log('🔄 Falling back to mock headlines...');
        const mockData = {
            status: "ok",
            totalResults: 3,
            articles: [
                {
                    source: { id: "mock-source", name: "Mock News" },
                    author: "Mock Author",
                    title: "Sample Breaking News - Mock Data",
                    description: "This is a sample news article for testing purposes while the API is unavailable.",
                    url: "https://example.com/news/1",
                    urlToImage: "https://via.placeholder.com/400x200/0066cc/ffffff?text=News+Image",
                    publishedAt: new Date().toISOString(),
                    content: "This is sample content for testing the news aggregator application."
                },
                {
                    source: { id: "mock-source-2", name: "Mock Tech News" },
                    author: "Tech Reporter",
                    title: "Technology Update - Mock Article",
                    description: "Sample technology news article for development and testing purposes.",
                    url: "https://example.com/news/2",
                    urlToImage: "https://via.placeholder.com/400x200/00cc66/ffffff?text=Tech+News",
                    publishedAt: new Date(Date.now() - 3600000).toISOString(),
                    content: "Mock technology content for testing purposes."
                },
                {
                    source: { id: "mock-source-3", name: "Mock Sports" },
                    author: "Sports Writer",
                    title: "Sports News Update - Mock Data",
                    description: "Sample sports news article for application testing.",
                    url: "https://example.com/news/3",
                    urlToImage: "https://via.placeholder.com/400x200/cc6600/ffffff?text=Sports",
                    publishedAt: new Date(Date.now() - 7200000).toISOString(),
                    content: "Mock sports content for development testing."
                }
            ]
        };
        res.json(mockData);
    }
});

// General news endpoint with search capability
app.get('/news', async (req, res) => {
    try {
        console.log('📰 Fetching general news from News API...');
        const searchQuery = req.query.q || 'technology';
        const language = req.query.language || 'en';
        const sortBy = req.query.sortBy || 'publishedAt';
        const pageSize = req.query.pageSize || 50;
        const page = req.query.page || 1;
        
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&language=${language}&sortBy=${sortBy}&pageSize=${pageSize}&page=${page}&apiKey=${process.env.NEWS_API_KEY}`;
        
        const response = await axios.get(url);
        console.log(`✅ News received: ${response.data.articles?.length} articles for query "${searchQuery}"`);
        res.json(response.data);
    } catch (error) {
        console.error('❌ Error fetching news:', error.response?.data || error.message);
        
        // Fallback to mock data
        console.log('🔄 Falling back to mock news...');
        const mockData = {
            status: "ok",
            totalResults: 5,
            articles: [
                {
                    source: { id: "mock-tech", name: "Tech Daily" },
                    author: "John Developer",
                    title: "Latest JavaScript Framework Released - Mock Article",
                    description: "A new JavaScript framework promises to revolutionize web development. This is mock data for testing.",
                    url: "https://example.com/tech/1",
                    urlToImage: "https://via.placeholder.com/400x200/4285f4/ffffff?text=JavaScript",
                    publishedAt: new Date().toISOString(),
                    content: "Mock article about JavaScript frameworks for testing purposes."
                },
                {
                    source: { id: "mock-ai", name: "AI Weekly" },
                    author: "Sarah AI",
                    title: "Artificial Intelligence Breakthrough - Mock News",
                    description: "Researchers achieve new milestone in artificial intelligence. This is sample content for testing.",
                    url: "https://example.com/ai/1",
                    urlToImage: "https://via.placeholder.com/400x200/34a853/ffffff?text=AI+News",
                    publishedAt: new Date(Date.now() - 1800000).toISOString(),
                    content: "Mock AI news content for application testing."
                },
                {
                    source: { id: "mock-startup", name: "Startup Times" },
                    author: "Mike Entrepreneur",
                    title: "Startup Funding Round Closes - Test Article",
                    description: "Local startup raises significant funding in latest round. Sample news for development.",
                    url: "https://example.com/startup/1",
                    urlToImage: "https://via.placeholder.com/400x200/ea4335/ffffff?text=Startup",
                    publishedAt: new Date(Date.now() - 3600000).toISOString(),
                    content: "Mock startup news for testing the news aggregator."
                },
                {
                    source: { id: "mock-crypto", name: "Crypto Report" },
                    author: "Lisa Blockchain",
                    title: "Cryptocurrency Market Update - Mock Data",
                    description: "Latest developments in cryptocurrency markets. This is test content for the app.",
                    url: "https://example.com/crypto/1",
                    urlToImage: "https://via.placeholder.com/400x200/fbbc04/ffffff?text=Crypto",
                    publishedAt: new Date(Date.now() - 5400000).toISOString(),
                    content: "Mock cryptocurrency content for development testing."
                },
                {
                    source: { id: "mock-science", name: "Science Today" },
                    author: "Dr. Research",
                    title: "Scientific Discovery Announced - Test Article",
                    description: "New scientific research published with promising results. Sample content for testing.",
                    url: "https://example.com/science/1",
                    urlToImage: "https://via.placeholder.com/400x200/9c27b0/ffffff?text=Science",
                    publishedAt: new Date(Date.now() - 7200000).toISOString(),
                    content: "Mock science news for application development."
                }
            ]
        };
        res.json(mockData);
    }
});

// Search endpoint for custom queries
app.get('/search', async (req, res) => {
    try {
        const searchQuery = req.query.q;
        if (!searchQuery) {
            return res.status(400).json({ error: 'Search query is required' });
        }
        
        console.log(`🔍 Searching for: "${searchQuery}"`);
        const language = req.query.language || 'en';
        const sortBy = req.query.sortBy || 'publishedAt';
        const pageSize = req.query.pageSize || 50;
        const page = req.query.page || 1;
        
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&language=${language}&sortBy=${sortBy}&pageSize=${pageSize}&page=${page}&apiKey=${process.env.NEWS_API_KEY}`;
        
        const response = await axios.get(url);
        console.log(`✅ Search results: ${response.data.articles?.length} articles found for "${searchQuery}"`);
        res.json(response.data);
    } catch (error) {
        console.error('❌ Error searching news:', error.response?.data || error.message);
        res.status(500).json({ 
            error: 'Search failed', 
            message: 'Unable to search articles at this time' 
        });
    }
});

// Mock summarize endpoint
app.post('/summarize', async (req, res) => {
    try {
        const { text, title } = req.body;
        
        if (!text) {
            return res.status(400).json({ error: 'Text is required for summarization' });
        }
        
        console.log('🤖 Generating AI summary for:', title || 'Article');
        
        // Mock AI-powered summarization
        const mockSummary = `**AI Summary of "${title || 'Article'}":**\n\n` +
            `• **Key Points**: This article discusses important developments and provides insights into current events.\n\n` +
            `• **Main Theme**: The content covers significant topics that are relevant to current affairs and public interest.\n\n` +
            `• **Impact**: The information presented has implications for readers and may influence public opinion or policy.\n\n` +
            `• **Context**: This news fits within broader trends and ongoing developments in the field.\n\n` +
            `*Note: This is a mock AI summary for demonstration purposes. In a production environment, this would integrate with services like OpenAI GPT, Google Bard, or similar AI platforms.*`;
        
        setTimeout(() => {
            res.json({ 
                summary: mockSummary,
                confidence: 0.85,
                wordCount: text.split(' ').length,
                source: 'Mock AI Assistant'
            });
        }, 1500); // Simulate API delay
        
    } catch (error) {
        console.error('❌ Error generating summary:', error.message);
        res.status(500).json({ 
            error: 'Summarization failed', 
            message: 'Unable to generate summary at this time' 
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 News Aggregator Backend running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`📰 Headlines: http://localhost:${PORT}/headlines`);
    console.log(`🔍 News: http://localhost:${PORT}/news`);
    console.log(`🔎 Search: http://localhost:${PORT}/search?q=your-query`);
    console.log(`🤖 Summarize: POST http://localhost:${PORT}/summarize`);
});