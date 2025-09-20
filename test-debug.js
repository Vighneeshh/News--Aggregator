// Test the debug endpoint to see what's happening with environment variables
const https = require('https');

function testDebugEndpoint() {
    return new Promise((resolve, reject) => {
        const url = 'https://news-aggregator-pppy.onrender.com/debug';
        console.log('🔍 Testing debug endpoint...');
        
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    console.log('🐛 Debug Information:');
                    console.log('===========================');
                    console.log(JSON.stringify(parsed, null, 2));
                    console.log('===========================');
                    
                    // Analyze the results
                    console.log('\n📊 Analysis:');
                    console.log(`- News API Key exists: ${parsed.env.NEWS_API_KEY ? 'YES' : 'NO'}`);
                    console.log(`- News API Key length: ${parsed.env.NEWS_API_KEY?.length || 0} characters`);
                    console.log(`- OpenAI Key exists: ${parsed.env.OPENAI_API_KEY ? 'YES' : 'NO'}`);
                    console.log(`- Port setting: ${parsed.env.PORT || 'default'}`);
                    console.log(`- Node Environment: ${parsed.env.NODE_ENV || 'not set'}`);
                    
                    if (!parsed.env.NEWS_API_KEY) {
                        console.log('\n⚠️  WARNING: News API key is not loaded on Render!');
                        console.log('   This explains why we\'re getting mock data.');
                        console.log('   Need to check Render environment variable settings.');
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

testDebugEndpoint().catch(console.error);