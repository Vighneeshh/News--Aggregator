// Test RSS backend on Render
const https = require('https');

function testRSSEndpoint(endpoint) {
    return new Promise((resolve, reject) => {
        const url = `https://news-aggregator-pppy.onrender.com${endpoint}`;
        console.log(`🧪 Testing ${endpoint}...`);
        
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    console.log(`✅ ${endpoint} Results:`);
                    console.log(`   Status: ${parsed.status}`);
                    console.log(`   Articles: ${parsed.articles?.length || 0}`);
                    console.log(`   Total Results: ${parsed.totalResults || 0}`);
                    
                    if (parsed.articles && parsed.articles.length > 0) {
                        const first = parsed.articles[0];
                        console.log(`   First Title: ${first.title?.substring(0, 60)}...`);
                        console.log(`   Source: ${first.source?.name}`);
                        console.log(`   Has Image: ${!!first.urlToImage}`);
                        console.log(`   Published: ${first.publishedAt}`);
                        
                        // Check if this is real RSS data (not mock)
                        const isRealData = first.source?.name === 'BBC News' || 
                                         first.source?.name === 'CNN' ||
                                         first.title?.includes('BBC') ||
                                         first.url?.includes('bbc.com') ||
                                         first.url?.includes('cnn.com');
                        console.log(`   Real RSS Data: ${isRealData ? 'YES ✅' : 'NO ❌'}`);
                    }
                    resolve(parsed);
                } catch (e) {
                    console.log(`❌ Parse Error for ${endpoint}:`, e.message);
                    console.log('Raw response:', data.substring(0, 200));
                    reject(e);
                }
            });
        }).on('error', (err) => {
            console.log(`❌ Request Error for ${endpoint}:`, err.message);
            reject(err);
        });
    });
}

async function testRSSBackend() {
    try {
        console.log('🎯 Testing RSS-powered backend on Render...');
        console.log('='.repeat(50));
        
        await testRSSEndpoint('/headlines');
        console.log('\n' + '-'.repeat(30) + '\n');
        await testRSSEndpoint('/news');
        
        console.log('\n' + '='.repeat(50));
        console.log('🎉 RSS Backend Test Complete!');
        console.log('If you see "Real RSS Data: YES", the News API problem is solved!');
        
    } catch (error) {
        console.error('Test failed:', error);
    }
}

testRSSBackend();