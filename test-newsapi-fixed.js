// Test News API with User-Agent header
const https = require('https');

function testNewsAPIWithUserAgent() {
    const apiKey = '96885e3d615445c08ce0b9d2a4df0043';
    const url = `https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey=${apiKey}`;
    
    console.log('Testing News API with User-Agent header...');
    
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'User-Agent': 'News-Aggregator/1.0 (https://news-aggregator-pppy.onrender.com)'
            }
        };
        
        const req = https.get(url, options, (res) => {
            console.log('Status Code:', res.statusCode);
            
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    if (res.statusCode !== 200) {
                        console.log('Error Response:', data);
                        reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                        return;
                    }
                    
                    const parsed = JSON.parse(data);
                    console.log('✅ Success! Articles found:', parsed.articles?.length);
                    console.log('Total Results:', parsed.totalResults);
                    
                    if (parsed.articles && parsed.articles.length > 0) {
                        const first = parsed.articles[0];
                        console.log('\n📰 First real article:');
                        console.log('Title:', first.title);
                        console.log('Source:', first.source?.name);
                        console.log('Author:', first.author);
                        console.log('Has Image:', !!first.urlToImage);
                        if (first.urlToImage) {
                            console.log('Image URL:', first.urlToImage.substring(0, 80) + '...');
                        }
                        console.log('Published:', first.publishedAt);
                    }
                    
                    resolve(parsed);
                } catch (e) {
                    console.log('Parse Error. Raw response:', data.substring(0, 500));
                    reject(e);
                }
            });
        });
        
        req.on('error', reject);
    });
}

testNewsAPIWithUserAgent().catch(console.error);