// Test News API directly
const https = require('https');

function testNewsAPI() {
    const apiKey = '96885e3d615445c08ce0b9d2a4df0043';
    const url = `https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey=${apiKey}`;
    
    console.log('Testing News API directly...');
    console.log('URL:', url.replace(apiKey, '[API_KEY]'));
    
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            console.log('Status Code:', res.statusCode);
            console.log('Headers:', res.headers);
            
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
                    console.log('Success! Articles found:', parsed.articles?.length);
                    
                    if (parsed.articles && parsed.articles.length > 0) {
                        const first = parsed.articles[0];
                        console.log('\nFirst real article:');
                        console.log('Title:', first.title);
                        console.log('Source:', first.source?.name);
                        console.log('Has Image:', !!first.urlToImage);
                        console.log('Image URL:', first.urlToImage?.substring(0, 80) + '...');
                        console.log('Published:', first.publishedAt);
                    }
                    
                    resolve(parsed);
                } catch (e) {
                    console.log('Parse Error. Raw response:', data.substring(0, 500));
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

testNewsAPI().catch(console.error);