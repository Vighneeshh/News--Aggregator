// Test all backend endpoints and check environment
const https = require('https');

function makeRequest(endpoint) {
    return new Promise((resolve, reject) => {
        const url = `https://news-aggregator-pppy.onrender.com${endpoint}`;
        console.log(`\n🔍 Testing ${endpoint}...`);
        
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    console.log(`✅ Status: ${parsed.status}`);
                    
                    if (endpoint === '/health') {
                        console.log(`📊 Health Data:`, parsed);
                    } else if (parsed.articles) {
                        console.log(`📰 Articles: ${parsed.articles.length}`);
                        console.log(`📊 Total Results: ${parsed.totalResults}`);
                        
                        if (parsed.articles.length > 0) {
                            const first = parsed.articles[0];
                            console.log(`🏷️  First Title: ${first.title?.substring(0, 60)}...`);
                            console.log(`🏢 Source: ${first.source?.name}`);
                            console.log(`🖼️  Image: ${first.urlToImage ? 'YES' : 'NO'}`);
                            if (first.urlToImage) {
                                console.log(`🔗 Image URL: ${first.urlToImage.substring(0, 60)}...`);
                            }
                            
                            // Check if this looks like real or mock data
                            const isMockData = first.title?.includes('Breaking: Major Technology') || 
                                             first.title?.includes('Revolutionary AI Technology');
                            console.log(`🤖 Mock Data: ${isMockData ? 'YES' : 'NO'}`);
                        }
                    }
                    resolve(parsed);
                } catch (e) {
                    console.log('❌ Parse Error:', e.message);
                    console.log('Raw response (first 200 chars):', data.substring(0, 200));
                    reject(e);
                }
            });
        }).on('error', (err) => {
            console.log('❌ Request Error:', err.message);
            reject(err);
        });
    });
}

async function testAllEndpoints() {
    try {
        await makeRequest('/health');
        await makeRequest('/headlines');
        await makeRequest('/news');
        
        console.log('\n🎯 Summary:');
        console.log('- If you see mock data titles, the News API is still failing');
        console.log('- If you see real news titles, the News API is working');
        console.log('- Check image URLs: mock uses placeholder.com, real uses actual news sites');
        
    } catch (error) {
        console.error('Test failed:', error);
    }
}

testAllEndpoints();