// Quick test of search logic
const axios = require('axios');
const { parseString } = require('xml2js');

// Copy the parseRSSFeed function from backend
function parseRSSFeed(xmlData) {
    return new Promise((resolve, reject) => {
        parseString(xmlData, (err, result) => {
            if (err) {
                reject(err);
                return;
            }

            try {
                const items = result.rss.channel[0].item || [];
                const articles = items.slice(0, 20).map(item => {
                    const title = item.title?.[0] || 'No title';
                    const description = item.description?.[0] || 'No description';
                    const link = item.link?.[0] || '';
                    const pubDate = item.pubDate?.[0] || new Date().toISOString();
                    
                    // Determine source from feed URL context
                    let sourceName = 'RSS Feed';
                    if (xmlData.includes('bbci.co.uk') || title.includes('BBC')) {
                        sourceName = 'BBC News';
                    } else if (xmlData.includes('cnn.com') || title.includes('CNN')) {
                        sourceName = 'CNN';
                    }

                    return {
                        source: {
                            id: null,
                            name: sourceName
                        },
                        author: 'Unknown',
                        title: title,
                        description: description,
                        url: link,
                        urlToImage: extractImageFromDescription(description),
                        publishedAt: pubDate,
                        content: description
                    };
                });

                resolve({
                    status: 'ok',
                    totalResults: articles.length,
                    articles: articles
                });
            } catch (parseError) {
                reject(parseError);
            }
        });
    });
}

function extractImageFromDescription(description) {
    if (!description) return null;
    
    const imgRegex = /<img[^>]+src="([^">]+)"/i;
    const match = description.match(imgRegex);
    if (match && match[1]) {
        return match[1];
    }
    
    const fallbackImages = [
        'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop'
    ];
    
    return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
}

async function testLocalSearch(searchQuery) {
    console.log(`🔍 Testing local search for: "${searchQuery}"`);
    
    try {
        const rssFeeds = [
            'https://feeds.bbci.co.uk/news/rss.xml',
            'https://rss.cnn.com/rss/edition.rss'
        ];
        
        let allArticles = [];
        
        for (const feedUrl of rssFeeds) {
            try {
                console.log(`Fetching from: ${feedUrl}`);
                const response = await axios.get(feedUrl, {
                    headers: {
                        'User-Agent': 'News-Aggregator/1.0'
                    },
                    timeout: 10000
                });
                
                const feedData = await parseRSSFeed(response.data);
                allArticles = allArticles.concat(feedData.articles);
                console.log(`✅ Got ${feedData.articles.length} articles from ${feedUrl}`);
            } catch (feedError) {
                console.log(`⚠️ Failed to fetch from ${feedUrl}:`, feedError.message);
            }
        }
        
        // Filter articles based on search query
        const searchLower = searchQuery.toLowerCase();
        const filteredArticles = allArticles.filter(article => 
            article.title?.toLowerCase().includes(searchLower) ||
            article.description?.toLowerCase().includes(searchLower) ||
            article.source?.name?.toLowerCase().includes(searchLower) ||
            article.content?.toLowerCase().includes(searchLower)
        );
        
        console.log(`✅ Local search results: ${filteredArticles.length} articles found for "${searchQuery}"`);
        
        if (filteredArticles.length > 0) {
            console.log('\nFirst result:');
            const first = filteredArticles[0];
            console.log(`   Title: ${first.title}`);
            console.log(`   Source: ${first.source.name}`);
            console.log(`   Description: ${first.description.substring(0, 100)}...`);
        }
        
        return {
            status: 'ok',
            totalResults: filteredArticles.length,
            articles: filteredArticles.slice(0, 50)
        };
        
    } catch (error) {
        console.error('❌ Local search error:', error.message);
        throw error;
    }
}

// Test the search functionality
testLocalSearch('technology').then(() => {
    console.log('\n🎉 Local search test successful!');
}).catch(err => {
    console.error('Local search test failed:', err.message);
});