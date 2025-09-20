// Test the News API test endpoint
const https = require('https');

function testNewsAPIEndpoint() {
    return new Promise((resolve, reject) => {
        const url = 'https://news-aggregator-pppy.onrender.com/test-newsapi';
        console.log('🧪 Testing News API test endpoint...');
        
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    console.log('📊 News API Test Results:');
                    console.log('========================');
                    console.log(JSON.stringify(parsed, null, 2));
                    console.log('========================');
                    
                    if (parsed.success) {
                        console.log('🎉 SUCCESS! News API is working!');
                        console.log(`📰 Found ${parsed.articlesCount} articles`);
                        if (parsed.firstArticle) {
                            console.log(`🏷️  First article: ${parsed.firstArticle.title}`);
                            console.log(`🏢 Source: ${parsed.firstArticle.source}`);
                            console.log(`🖼️  Has image: ${parsed.firstArticle.hasImage}`);
                        }
                    } else {
                        console.log('❌ FAILED! News API error:');
                        console.log(`   Error: ${parsed.error}`);
                        console.log(`   Status: ${parsed.status}`);
                        console.log(`   Message: ${parsed.message}`);
                    }
                    
                    resolve(parsed);
                } catch (e) {
                    console.log('❌ Parse Error:', e.message);
                    console.log('Raw response:', data.substring(0, 500));
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

testNewsAPIEndpoint().catch(console.error);