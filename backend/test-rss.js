// Test RSS headlines locally
const http = require('http');

http.get('http://localhost:5001/headlines', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const parsed = JSON.parse(data);
            console.log('🎯 RSS Headlines Test Results:');
            console.log('================================');
            console.log('Status:', parsed.status);
            console.log('Total Results:', parsed.totalResults);
            console.log('Articles:', parsed.articles?.length);
            
            if (parsed.articles && parsed.articles.length > 0) {
                console.log('\n📰 First 3 Articles:');
                parsed.articles.slice(0, 3).forEach((article, i) => {
                    console.log(`\n${i + 1}. ${article.title.substring(0, 70)}...`);
                    console.log(`   Source: ${article.source.name}`);
                    console.log(`   Has Image: ${!!article.urlToImage}`);
                    console.log(`   URL: ${article.url.substring(0, 50)}...`);
                });
                
                console.log('\n✅ SUCCESS: Real RSS news data is working!');
            } else {
                console.log('❌ No articles found');
            }
        } catch (e) {
            console.log('❌ Parse error:', e.message);
            console.log('Raw response:', data.substring(0, 200));
        }
    });
}).on('error', (err) => {
    console.log('❌ Request error:', err.message);
    console.log('Make sure the backend server is running on port 5001');
});